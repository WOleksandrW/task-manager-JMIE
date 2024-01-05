const cryptography = require('../../func/cryptography');
const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const sendMessages = require('../func/sendMessages');
const authenticateToken = require('../func/authenticateToken');
const projectData = require('../data/project');

const { unPropsProject } = projectData;
const unPropsUser = ['password', 'notedItems', 'recentProjects', '__v'];

async function openHandler(socket, token) {
  if (!token) throw new Error('Not found token');

  const objUser = authenticateToken(token);
  
  if (objUser.type === 'error') {
    const messageError = { type: 'open', value: false, code: objUser.code };
    socket.send(JSON.stringify(messageError));
    return;
  }

  const user = await User.findOne({ email: objUser.email, password: objUser.password });
  if (!user) {
    const messageError = { type: 'open', value: false, code: '403' };
    socket.send(JSON.stringify(messageError));
    return;
  }
  const userId = user._id.toString();

  const messageOpen = JSON.stringify({ type: 'open', value: true });

  const resUser = {};
  Object.keys(user._doc)
    .filter((key) => !unPropsUser.includes(key))
    .forEach((key) => resUser[key] = user[key]);
  resUser['email'] = cryptography.decrypt(resUser['email']);

  const messageUser = JSON.stringify({ type: 'user', method: 'set', data: resUser });

  const projects = (await Project.find({}))
    .filter((project) => project.author.toString() === userId || project.team.some((id) => id.toString() === userId))
    .map((project) => {
      const tempProject = {};
      Object.keys(project._doc)
        .filter((key) => !unPropsProject.includes(key))
        .forEach((key) => tempProject[key] = project[key]);
      return tempProject;
    });
  const messageProjects = JSON.stringify({ type: 'project', method: 'get', data: projects });

  const tasks = (await Task.find({ executor: userId }));
  const messageTasks = JSON.stringify({ type: 'assigned', method: 'get', data: tasks });

  const messageNoted = JSON.stringify({ type: 'noted', method: 'get', data: user.notedItems });

  const messageRecent = JSON.stringify({ type: 'recent', method: 'set', data: user.recentProjects });

  sendMessages([socket], [messageUser, messageProjects, messageTasks, messageNoted, messageRecent, messageOpen]);

  return userId;
}

module.exports = openHandler;
const cryptography = require('../../func/cryptography');
const sendMessages = require('../func/sendMessages');
const checkId = require('../../func/checkId');
const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const projectData = require('../data/project');

const { unPropsSingle } = projectData;

async function joinHandler(socket, userId, projectId) {
  if (!projectId) throw new Error('Not found project id');
  if (!userId) throw new Error('Not found user id');

  let project;
  if (checkId(projectId)) project = await Project.findOne({ _id: projectId });

  if (!project || project.author.toString() !== userId && !project.team.some((id) => id.toString() === userId)) {
    const disableAnswer = JSON.stringify({type: 'single-project', method: 'disable', data: "None"});
    sendMessages([socket], [disableAnswer]);
    return;
  }

  const singleProject = {};
    Object.keys(project._doc)
      .filter((key) => !unPropsSingle.includes(key))
      .forEach((key) => singleProject[key] = project[key]);
  const projectAnswer = JSON.stringify({type: 'single-project', method: 'set', data: singleProject});

  const columnAnswer = JSON.stringify({type: 'column', method: 'set', data: project.columnList});

  const tasks = await Task.find({ projectId });
  const taskAnswer = JSON.stringify({type: 'task', method: 'get', data: tasks});

  const users = await User.find({});
  const filteredUsers = users
    .filter((user) => project.team.some((id) => id.toString() === user._id.toString()) || user._id.toString() === project.author.toString())
    .map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: cryptography.decrypt(user.email),
      color: user.color
    }));
  const userAnswer = JSON.stringify({type: 'team', method: 'get', data: filteredUsers});

  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error('Not found user');

  if (user.recentProjects.some((id) => id.toString() === projectId)) {
    user.recentProjects.splice(user.recentProjects.findIndex((data) => data.toString() === projectId), 1);
    user.recentProjects.unshift(projectId);
  } else {
    user.recentProjects.unshift(projectId);
  }

  if (user.recentProjects.length > 5) user.recentProjects.length = 5;

  await user.save();

  const recentAnswer = JSON.stringify({type: 'recent', method: 'set', data: user.recentProjects});

  sendMessages([socket], [recentAnswer, columnAnswer, projectAnswer, taskAnswer, userAnswer]);
}

module.exports = joinHandler;

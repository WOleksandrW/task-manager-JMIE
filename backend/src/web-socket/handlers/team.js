const cryptography = require('../../func/cryptography');
const sendMessages = require('../func/sendMessages');
const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const removeNotedItems = require('../func/removeNotedItems');
const removeRecentItems = require('../func/removeRecentItems');
const removeAssignedTasks = require('../func/removeAssignedTasks');
const projectData = require('../data/project');

const { unPropsProject } = projectData;

async function teamHandler(method, data, objDuct) {
  switch (method) {
    case 'add':
      await addUser(data, objDuct);
      break;
    case 'remove':
      await removeUser(data, objDuct);
      break;
    default:
      throw new Error('Method value is wrong in type team');
  }
}

async function addUser(data, objDuct) {
  if (typeof data._id !== 'string' && data._id === '') throw new Error('Not found property userId');

  const user = await User.findOne({ _id: data._id });
  if (!user) throw new Error('Not found user');
  
  const project = await Project.findOne({ _id: data.projectId });
  if (!project) throw new Error('Not found project');

  if (!project.team.some((id) => id.toString() === user._id.toString())) project.team.push(user._id);

  await project.save();

  const resUser = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: cryptography.decrypt(user.email),
    color: user.color
  };
  const answerAdded = JSON.stringify({type: 'team', method: 'get', data: [resUser]});
  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key])
    .map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerAdded]);
  });

  // Add Alert for current user
  const alert = {type: 'success', message: `You have successfully added ${user.firstName} ${user.lastName}`};
  const answerAlert = JSON.stringify({type: 'alerts', method: 'get', data: [alert]})
  sendMessages(objDuct.current.array.map((client) => client.socket), [answerAlert]);

  // Add Alert for other users in project
  const answerAlertInfo = JSON.stringify({type: 'alerts', method: 'get', data: [{type: 'info', message: `${user.firstName} ${user.lastName} added to the project`}]});
  const socketsArrOther = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key) && key !== objDuct.current.id)
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key])
    .map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrOther.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerAlertInfo]);
  });

  // Add a project to the new user's project list
  if (objDuct.all[data._id]) {
    const tempProject = {};
    Object.keys(project._doc)
      .filter((key) => !unPropsProject.includes(key))
      .forEach((key) => tempProject[key] = project[key]);
    const addedProject = JSON.stringify({type: 'project', method: 'get', data: [tempProject]});
    const newAlert = { type: 'info', message: `You have been added to new project "${project.title}"` };
    const answerNewAlert = JSON.stringify({type: 'alerts', method: 'get', data: [newAlert]})
    sendMessages(objDuct.all[data._id].map((client) => client.socket), [addedProject, answerNewAlert]);
  }
}

const OWN_SOLUTION = (project) => `You left the project "${project}"`;
const ADMIN_SOLUTION = (user) => `${user} was successfully removed from project`;

async function removeUser(data, objDuct) {
  const user = await User.findOne({ _id: data._id });
  if (!user) throw new Error('Not found user');

  const project = await Project.findOne({ _id: data.projectId });
  if (!project) throw new Error('Not found project');

  const idx = project.team.findIndex((id) => id.toString() === data._id);
  if (idx < 0) throw new Error('Not found user in team');

  const tasks = await Task.find({ projectId: data.projectId });
  const tasksByUser = tasks.filter((task) => task.executor === data._id);

  await removeRecentItems(objDuct, [data.projectId], [data._id]);
  await removeNotedItems(objDuct, [data.projectId, ...tasks.map((task) => task._id.toString())], [data._id]);
  await removeAssignedTasks(objDuct, tasksByUser, [data._id]);

  for (let i = 0; i < tasksByUser.length; i++) {
    tasksByUser[i].executor = 'auto';
    await tasksByUser[i].save();
  }

  project.team.splice(idx, 1);

  await project.save();
  
  const answerRemoved = JSON.stringify({type: 'team', method: 'delete', data: [data._id]});
  const answerUpdated = JSON.stringify({type: 'task', method: 'put', data: tasksByUser});
  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key])
    .map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerRemoved, answerUpdated]);
  });

  // Add Alert for other users in project
  const answerAlertInfo = JSON.stringify({type: 'alerts', method: 'get', data: [{type: 'info', message: `${user.firstName} ${user.lastName} left the project`}]});
  const socketsArrOther = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key) && key !== data._id && key !== objDuct.current.id)
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key])
    .map((array) => array.filter((client) => client.projectEnv === project._id.toString())); 
  socketsArrOther.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerAlertInfo]);
  });

  // Add Alert for action user (collaborator / admin)
  const alert = {
    type: 'success',
    message: objDuct.current.id === data._id ? OWN_SOLUTION(project.title) : ADMIN_SOLUTION(`${user.firstName} ${user.lastName}`)
  };
  const answerAlert = JSON.stringify({type: 'alerts', method: 'get', data: [alert]});
  sendMessages(objDuct.current.array.map((client) => client.socket), [answerAlert]);

  if (objDuct.all[data._id]) {
    const answers = [];

    // Add Alert for collaborator, when was removed by admin
    if (objDuct.current.id !== data._id) {
      const alert = {
        type: 'info',
        message: `You have been removed from the project "${project.title}"`
      };
      const answerAlert = JSON.stringify({type: 'alerts', method: 'get', data: [alert]});
      answers.push(answerAlert);
    }

    // Remove a project from the user's project list
    const answerSingle = JSON.stringify({type: 'single-project', method: 'delete', data: project._id});
    const removedProject = JSON.stringify({type: 'project', method: 'delete', data: [data.projectId]});
    answers.push(answerSingle, removedProject);

    sendMessages(objDuct.all[data._id].map((client) => client.socket), answers);
  }
}

module.exports = teamHandler;

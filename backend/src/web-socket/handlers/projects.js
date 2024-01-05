const ObjectId = require('mongoose').Types.ObjectId;
const sendMessages = require('../func/sendMessages');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const Comment = require('../../models/Comment');
const removeNotedItems = require('../func/removeNotedItems');
const removeRecentItems = require('../func/removeRecentItems');
const removeAssignedTasks = require('../func/removeAssignedTasks');
const projectData = require('../data/project');

const { unPropsSingle, unPropsProject } = projectData;

const projectProperties = ['title', 'description', 'key', 'badge'];

async function projectsHandler(method, data, objDuct) {
  switch (method) {
    case 'create':
      await createProject(data, objDuct);
      break;
    case 'update':
      await updateProject(data, objDuct);
      break;
    case 'remove':
      await removeProject(data, objDuct);
      break;
    default:
      throw new Error('Method value is wrong in type project');
  }
}

async function createProject(data, objDuct) {
  const values = {};
  const error = [];

  [...projectProperties, 'author'].forEach((property) => {
    if (typeof data[property] !== 'string') error.push(`Property ${property} is of the wrong type`);
    else if (data[property].trim() === '') error.push(`Property ${property} can't be empty`);
    values[property] = data[property];
  });
  if (error.length) throw new Error(`${error.join('. ')}.`);

  const project = new Project({
    ...values,
    boardTitle: `Board ${values.title}`,
    team: [],
    columnList: [],
  });

  project.columnList.push({
    title: "todo",
    type: "common"
  });

  project.columnList.push({
    title: "dev",
    type: "common"
  });

  project.columnList.push({
    title: "done",
    type: "final"
  });

  await project.save();

  const tempProject = {};
  Object.keys(project._doc)
    .filter((key) => !unPropsProject.includes(key))
    .forEach((key) => tempProject[key] = project[key]);
  const answerCreated = JSON.stringify({type: 'project', method: 'get', data: [tempProject]});

  // Add Alert for current user
  const alert = { type: 'success', message: `Project "${project.title}" was created successfully` };
  const answerAlert = JSON.stringify({type: 'alerts', method: 'get', data: [alert]});
  sendMessages(objDuct.current.array.map((client) => client.socket), [answerCreated, answerAlert]);
}

async function updateProject(data, objDuct) {
  const { _id, author, ...rest } = data;

  const newProjectProps = [...projectProperties, 'boardTitle'];

  const project = await Project.findOne({ _id });
  if (!project) throw new Error('Not found project');

  Object.entries(rest).filter((arr) => newProjectProps.includes(arr[0])).forEach((arr) => {
    if (typeof arr[1] !== 'string') throw new Error(`Property ${property} is of the wrong type`);
    else if (arr[1].trim() === '') throw new Error(`Property ${property} can't be empty`);
    project[arr[0]] = arr[1];
  });

  if (author) {
    if (!project.team.some((id) => id.toString() === author)) throw new Error(`There is no user ${author} in team`);

    const admin = project.author;
    project.author = new ObjectId(author);
    project.team.splice(project.team.findIndex((data) => data.toString() === author), 1, admin);
  }

  await project.save();

  const tempProject = {};
  Object.keys(project._doc)
    .filter((key) => !unPropsProject.includes(key))
    .forEach((key) => tempProject[key] = project[key]);
  const answerUpdated = JSON.stringify({type: 'project', method: 'put', data: [tempProject]});

  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key]);

  socketsArrTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerUpdated]);
  });

  // Add Alert for current user
  const alert = { type: 'success', message: `Project "${project.title}" was updated successfully` };
  const answerAlert = JSON.stringify({type: 'alerts', method: 'get', data: [alert]});
  sendMessages(objDuct.current.array.map((client) => client.socket), [answerAlert]);

  // Answer Single Project
  const singleProject = {};
  Object.keys(project._doc)
    .filter((key) => !unPropsSingle.includes(key))
    .forEach((key) => singleProject[key] = project[key]);
  const answerSingle = JSON.stringify({type: 'single-project', method: 'set', data: singleProject});

  const socketsArrProjectEnv = socketsArrTeam.map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrProjectEnv.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerSingle]);
  });
}

async function removeProject(data, objDuct) {
  const project = await Project.findOne({ _id: data._id });
  if (!project) throw new Error('Not found project');

  const tasks = await Task.find({ projectId: data._id });

  await removeRecentItems(objDuct, [data._id], [project.author, ...project.team]);
  await removeNotedItems(objDuct, [data._id, ...tasks.map((task) => task._id.toString())], [project.author, ...project.team]);
  await removeAssignedTasks(objDuct, tasks);

  for (let i = 0; i < tasks.length; i++) {
    await Comment.deleteMany({ taskId: tasks[i]._id })
  }
  await Task.deleteMany({ projectId: project._id });
  await Project.deleteOne({ _id: project._id });

  // Answer Projects
  const answerRemoved = JSON.stringify({type: 'project', method: 'delete', data: [data._id]});
  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key]);

  socketsArrTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerRemoved]);
  });

  // Answer Single Project
  const answerSingle = JSON.stringify({type: 'single-project', method: 'delete', data: project._id});
  const socketsArrProjectEnv = socketsArrTeam.map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrProjectEnv.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerSingle]);
  });

  // Add Alert for current user
  const currentAlert = { type: 'success', message: `Project "${project.title}" was deleted successfully` };
  const answerCurrentAlert = JSON.stringify({type: 'alerts', method: 'get', data: [currentAlert]});
  sendMessages(objDuct.current.array.map((client) => client.socket), [answerCurrentAlert]);

  // Add Alert for other users
  const alert = { type: 'info', message: `Project "${project.title}" has been deleted` };
  const answerAlert = JSON.stringify({type: 'alerts', method: 'get', data: [alert]});
  const socketsArrOnlyTeam = Object.keys(objDuct.all)
    .filter((key) => project.team.some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key]);

  socketsArrOnlyTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerAlert]);
  });
}

module.exports = projectsHandler;

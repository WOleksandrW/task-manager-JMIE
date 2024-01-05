const sendMessages = require('../func/sendMessages');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const Comment = require('../../models/Comment');
const removeNotedItems = require('../func/removeNotedItems');
const removeAssignedTasks = require('../func/removeAssignedTasks');

const taskProperties = ['title', 'description', 'author', 'columnId', 'executor'];

async function tasksHandler(method, data, objDuct, projectEnv) {
  switch (method) {
    case 'create':
      await createTask(data, objDuct, projectEnv);
      break;
    case 'update':
      await updateTask(data, objDuct, projectEnv);
      break;
    case 'remove':
      await removeTasks(data, objDuct, projectEnv);
      break;
    default:
      throw new Error('Method value is wrong in type task');
  }
}

async function createTask(data, objDuct, projectEnv) {
  const values = {};
  const error = [];

  [...taskProperties, 'projectId'].forEach((property) => {
    if (typeof data[property] !== 'string') error.push(`Property ${property} is of the wrong type`);
    else if (property !== 'description' && data[property].trim() === '') error.push(`Property ${property} can't be empty`);
    values[property] = data[property];
  });
  if (error.length) throw new Error(`${error.join('. ')}.`);

  const maxId = Math.max(...(await Task.find({ projectId: data.projectId })).map((task) => task.id), 0);

  const project = await Project.findOne({ _id: projectEnv });
  if (!project) throw new Error('Not found project');
  const column = project.columnList.find((col) => col._id.toString() === data.columnId);
  if (!column) throw new Error('Not found column');

  const usedTasks = await Task.find({ columnId: data.columnId });
  if (column.limit > 0 && usedTasks.length + 1 > column.limit)
    throw new Error(`This action exceeds the maximum number of tasks (${column.limit}) in column "${column.title}"`);

  const task = new Task({
    ...values,
    id: maxId + 1
  });

  await task.save();

  const answerCreated = JSON.stringify({type: 'task', method: 'get', data: [task]});

  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key]);
  const socketsArrProjectEnv = socketsArrTeam.map((array) => array.filter((client) => client.projectEnv === project._id.toString()));

  socketsArrProjectEnv.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerCreated]);
  });
}

async function updateTask(data, objDuct, projectEnv) {
  const { _id, ...rest } = data;

  const task = await Task.findOne({ _id });
  if (!task) throw new Error('Not found task');

  const project = await Project.findOne({ _id: projectEnv });
  if (!project) throw new Error('Not found project');

  if (data.columnId && task.columnId.toString() !== data.columnId) {
    const column = project.columnList.find((col) => col._id.toString() === data.columnId);
    if (!column) {
      const answerUpdated = JSON.stringify({type: 'task', method: 'put', data: [task]});
      sendMessages(objDuct.current.array.map((client) => client.socket), [answerUpdated]);
      throw new Error('Not found new column');
    }

    const usedTasks = await Task.find({ columnId: data.columnId });
    if (column.limit > 0 && usedTasks.length + 1 > column.limit) {
      const answerUpdated = JSON.stringify({type: 'task', method: 'put', data: [task]});
      sendMessages(objDuct.current.array.map((client) => client.socket), [answerUpdated]);
      throw new Error(`This action exceeds the maximum number of tasks (${column.limit}) in column "${column.title}"`);
    } 
  }

  Object.entries(rest).filter((arr) => taskProperties.includes(arr[0])).forEach((arr) => {
    if (typeof arr[1] !== 'string') throw new Error(`Property ${property} is of the wrong type`);
    else if (arr[0] !== 'description' && arr[1].trim() === '') throw new Error(`Property ${property} can't be empty`);
    task[arr[0]] = arr[1];
  });

  if (rest['priority']) {
    const value = +rest['priority'];
    if (Number.isNaN(value)) throw new Error('Property priority is of the wrong type');
    task['priority'] = value;
  }

  await task.save();

  if (rest.executor) {
    const oldUser = objDuct.all[task.executor];
    if (oldUser) {
      const message = JSON.stringify({type: 'assigned', method: 'delete', data: [task._id]});
      sendMessages(oldUser.map((client) => client.socket), [message]);
    }
  
    const newUser = objDuct.all[rest.executor];
    if (newUser) {
      const message = JSON.stringify({type: 'assigned', method: 'get', data: [task]});
      sendMessages(newUser.map((client) => client.socket), [message]);
    }
  }

  // Update assigned tasks for executor
  if (!rest.executor && task.executor !== 'auto' && objDuct.all[task.executor]) {
    const message = JSON.stringify({type: 'assigned', method: 'put', data: [task]});
    sendMessages(objDuct.all[task.executor].map((client) => client.socket), [message]);
  }

  const answerUpdated = JSON.stringify({type: 'task', method: 'put', data: [task]});

  const socketsArrTeam = Object.keys(objDuct.all)
  .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
  .filter((key) => !!objDuct.all[key])
  .map((key) => objDuct.all[key]);
  const socketsArrProjectEnv = socketsArrTeam.map((array) => array.filter((client) => client.projectEnv === project._id.toString()));

  socketsArrProjectEnv.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerUpdated]);
  });
}

async function removeTasks(data, objDuct, projectEnv) {
  let tasks = [];
  let taskIds = [];

  if (data.projectId) {
    tasks = await Task.find({ projectId: data.projectId });
    taskIds = tasks.map((task) => task._id.toString());

    await removeNotedItems(objDuct, taskIds);

    await Task.deleteMany({ projectId: data.projectId });
  } else if (data.columnId) {
    tasks = await Task.find({ columnId: data.columnId });
    taskIds = tasks.map((task) => task._id.toString());

    await removeNotedItems(objDuct, taskIds);

    await Task.deleteMany({ columnId: data.columnId });
  } else {
    tasks = [await Task.findOne({ _id: data._id })];
    if (!tasks[0]) throw new Error('Not found task');
    taskIds = [data._id];

    await removeNotedItems(objDuct, taskIds);

    await Task.deleteOne({ _id: data._id });
  }

  // Remove comments
  for (let idx = 0; idx < taskIds.length; idx++) {
    await Comment.deleteMany({ taskId: taskIds[idx] });
  }

  await removeAssignedTasks(objDuct, tasks);

  const project = await Project.findOne({ _id: projectEnv });
  if (!project) throw new Error('Not found project');

  const answerRemoved = JSON.stringify({type: 'task', method: 'delete', data: taskIds});

  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key]);
  const socketsArrProjectEnv = socketsArrTeam.map((array) => array.filter((client) => client.projectEnv === project._id.toString()));

  socketsArrProjectEnv.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [answerRemoved]);
  });
}

module.exports = tasksHandler;

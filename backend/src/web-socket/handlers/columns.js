const sendMessages = require('../func/sendMessages');
const Project = require('../../models/Project');
const Task = require('../../models/Task');

const columnProperties = ['title', 'type'];
const valuesColumnType = ['common', 'final'];

async function columnsHandler(method, data, objDuct) {
  switch (method) {
    case 'create':
      await createColumn(data, objDuct);
      break;
    case 'update':
      await updateColumn(data, objDuct);
      break;
    case 'remove':
      if (data.newColumnId) await moveTasks(data, objDuct);
      await removeColumn(data, objDuct);
      break;
    case 'swap':
      await swapColumn(data, objDuct);
      break;
    default:
      throw new Error('Method value is wrong in type column');
  }
}

async function createColumn(data, objDuct) {
  const { projectId, ...rest } = data;

  const values = {};
  const error = [];

  columnProperties.forEach((property) => {
    if (typeof rest[property] !== 'string') error.push(`Property ${property} is of the wrong type`);
    else if (rest[property].trim() === '') error.push(`Property ${property} can't be empty`);
    values[property] = rest[property];
  });
  if (error.length) throw new Error(`${error.join('. ')}.`);
  if (valuesColumnType.indexOf(values.type) < 0) throw new Error('Property type has wrong value');

  const project = await Project.findOne({ _id: projectId });
  if (!project) throw new Error('Not found project');

  project.columnList.push(values);

  await project.save();

  const columnAnswer = JSON.stringify({type: 'column', method: 'set', data: project.columnList});
  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key])
    .map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [columnAnswer]);
  });
}

async function updateColumn(data, objDuct) {
  const { _id, projectId, limit, ...rest } = data;

  const project = await Project.findOne({ _id: projectId });
  if (!project) throw new Error('Not found project');

  const idx = project.columnList.findIndex((column) => column._id.toString() === _id);
  if (idx < 0) throw new Error('Not found column');

  Object.entries(rest).filter((arr) => columnProperties.includes(arr[0])).forEach((arr) => {
    if (typeof arr[1] !== 'string') throw new Error(`Property ${property} is of the wrong type`);
    else if (arr[1].trim() === '') throw new Error(`Property ${property} can't be empty`);
    if (arr[0] === 'type' && valuesColumnType.indexOf(arr[1]) < 0) throw new Error('Property type have wrong value');
    project.columnList[idx][arr[0]] = arr[1];
  });
  if (limit !== undefined) {
    if (typeof limit !== 'number') throw new Error('Property limit is of the wrong type');
    else if (limit < 0) throw new Error('Property limit cant be less than 0');
    const tasks = await Task.find({ columnId: _id });
    if (limit !== 0 && tasks.length > limit) throw new Error('Property limit cant be less than current number of tasks');
    project.columnList[idx].limit = limit;
  }

  await project.save();

  const columnAnswer = JSON.stringify({type: 'column', method: 'set', data: project.columnList});
  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key])
    .map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [columnAnswer]);
  });
}

async function removeColumn(data, objDuct) {
  const project = await Project.findOne({ _id: data.projectId });
  if (!project) throw new Error('Not found project');

  const idx = project.columnList.findIndex((column) => column._id.toString() === data._id);
  if (idx < 0) throw new Error('Not found column');

  project.columnList.splice(idx, 1);

  await project.save();

  const columnAnswer = JSON.stringify({type: 'column', method: 'set', data: project.columnList});
  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key])
    .map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [columnAnswer]);
  });
}

async function moveTasks(data, objDuct) {
  const tasks = await Task.find({ columnId: data._id });
  if (!tasks && tasks.length === 0) throw new Error('Not found tasks');

  const project = await Project.findOne({ _id: data.projectId });
  if (!project) throw new Error('Not found project');
  const column = project.columnList.find((col) => col._id.toString() === data.newColumnId);
  if (!column) throw new Error('Not found new column');

  const usedTasks = await Task.find({ columnId: data.newColumnId });
  if (column.limit > 0 && usedTasks.length + tasks.length > column.limit) 
    throw new Error(`This action exceeds the maximum number of tasks (${column.limit}) in column "${column.title}"`);

  for (let idx = 0; idx < tasks.length; idx++) {
    tasks[idx].columnId = data.newColumnId;
    await tasks[idx].save();
  }

  const taskAnswer = JSON.stringify({type: 'task', method: 'put', data: tasks});
  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key])
    .map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [taskAnswer]);
  });
}

async function swapColumn(data, objDuct) {
  const project = await Project.findOne({ _id: data.projectId });
  if (!project) throw new Error('Not found project');

  const columnIdx = project.columnList.findIndex((col) => col._id.toString() === data.columnId);
  if (columnIdx < 0) {
    const columnAnswer = JSON.stringify({type: 'column', method: 'set', data: project.columnList});
    sendMessages(objDuct.current.array.map((client) => client.socket), [columnAnswer]);
    throw new Error('Not found column');
  }

  const column = project.columnList.splice(columnIdx, 1)[0];
  project.columnList.splice(data.index, 0, column);

  await project.save();

  const columnAnswer = JSON.stringify({type: 'column', method: 'set', data: project.columnList});
  const socketsArrTeam = Object.keys(objDuct.all)
    .filter((key) => [project.author, ...project.team].some((id) => id.toString() === key))
    .filter((key) => !!objDuct.all[key])
    .map((key) => objDuct.all[key])
    .map((array) => array.filter((client) => client.projectEnv === project._id.toString()));
  socketsArrTeam.forEach((array) => {
    sendMessages(array.map((client) => client.socket), [columnAnswer]);
  });
}

module.exports = columnsHandler;

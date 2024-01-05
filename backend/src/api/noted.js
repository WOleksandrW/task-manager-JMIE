const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const authenticateToken = require('../func/authenticateToken');
const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const list = req.body.list;
    if (!list || !Array.isArray(list)) throw new Error('Not found list');

    const projectList = (await Promise.all(list
      .filter((item) => item.type === 'project')
      .map(async (item) => await Project.findOne({ _id: item._id }))))
      .map((item) => ({
        id: item._id.toString(),
        type: 'project',
        title: `${item.title} (${item.key})`,
        subtitle: 'Project',
        additional: {}
      }));
    
    const taskList = (await Promise.all(list
      .filter((item) => item.type === 'task')
      .map(async (item) => {
        const task = await Task.findOne({ _id: item._id });
        if (task) {
          const project = await Project.findOne({ _id: task.projectId });
          return {task, project};
        }
      })))
      .filter((item) => item && item.task && item.project)
      .map((item) => ({
        id: item.task._id.toString(),
        type: 'task',
        title: item.task.title,
        subtitle: `Task in ${item.project.title}`,
        additional: { projectId: item.project._id.toString() }
      }));

    res.json([...projectList, ...taskList])
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error! ${error.message}`);
  }
});

module.exports = router;

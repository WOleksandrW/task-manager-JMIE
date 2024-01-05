const express = require('express');
const Project = require('../models/Project');
const authenticateToken = require('../func/authenticateToken');
const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const list = req.body.list;
    if (!list || typeof list !== 'object' || Array.isArray(list)) throw new Error('Not found list');
    if (Object.values(list).some((arr) => !Array.isArray(arr))) throw new Error('List have wrong data');

    const result = {};

    const projectsId = Object.keys(list);
    for (let i = 0; i < projectsId.length; i++) {
      const project = await Project.findOne({ _id: projectsId[i] });
      if (!project) throw new Error('Not found project');

      result[projectsId[i]] = project.columnList.filter((col) => list[projectsId[i]].includes(col._id.toString()));
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error! ${error.message}`);
  }
});

module.exports = router;

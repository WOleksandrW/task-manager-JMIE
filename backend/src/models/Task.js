const { Schema, model } = require('mongoose');

const schema = new Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  author: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  executor: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    required: false,
    default: 1
  },
  projectId: {
    type: Schema.Types.ObjectId, 
    ref: 'Project',
    required: true
  },
  columnId: {
    type: Schema.Types.ObjectId, 
    ref: 'Column',
    required: true
  }
});

module.exports = model('Task', schema);
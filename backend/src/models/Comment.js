const { Schema, model } = require('mongoose');

const schema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId, 
    ref: 'Task',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  dateUpdate: {
    type: String,
    required: true
  }
});

module.exports = model('Comment', schema);

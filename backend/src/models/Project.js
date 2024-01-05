const { Schema, model } = require('mongoose');

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  boardTitle: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  team: {
    type: [Schema.Types.ObjectId], 
    ref: 'User',
    required: true
  },
  columnList: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      default: 0
    }
  }],
  badge: {
    type: String,
    default: ''
  }
});

module.exports = model('Project', schema);
const { Schema, model } = require('mongoose');

const schema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  notedItems: [{
    type: {
      type: String,
      required: true
    }
  }],
  recentProjects: {
    type: [Schema.Types.ObjectId], 
    ref: 'Project',
    default: []
  },
  jobTitleInfo: {
    type: String,
    default: ''
  },
  departmentInfo: {
    type: String,
    default: ''
  },
  organizationInfo: {
    type: String,
    default: ''
  },
  locationInfo: {
    type: String,
    default: ''
  },
  coverBlock: {
    type: String,
    default: ''
  }
});

module.exports = model('User', schema);
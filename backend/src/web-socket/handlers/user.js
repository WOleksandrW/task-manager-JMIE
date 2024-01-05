const cryptography = require('../../func/cryptography');
const sendMessages = require('../func/sendMessages');
const User = require('../../models/User');

const requiredUserProperties = ['firstName', 'lastName', 'email', 'password', 'coverBlock'];
const putUserProperties = ['firstName', 'lastName', 'jobTitleInfo', 'departmentInfo', 'organizationInfo', 'locationInfo', 'coverBlock'];
const unnecessaryProps = ['password', 'notedItems', 'recentProjects', '__v'];

async function userHandler(method, data, objDuct) {
  switch (method) {
    case 'update':
      await updateUser(data, objDuct);
      break;
    default:
      throw new Error('Method value is wrong in type task');
  }
}

async function updateUser(data, objDuct) {
  const { _id, ...rest } = data;

  const user = await User.findOne({ _id });
  if (!user) throw new Error('Not found user');

  Object.entries(rest).filter((arr) => putUserProperties.includes(arr[0])).forEach((arr) => {
    if (typeof arr[1] !== 'string') throw new Error(`Property ${property} is of the wrong type`);
    else if (requiredUserProperties.includes(arr[0]) && arr[1].trim() === '') throw new Error(`Property ${property} can't be empty`);
    user[arr[0]] = arr[1];
  });

  await user.save();

  const resUser = {};
  Object.keys(user._doc)
    .filter((key) => !unnecessaryProps.includes(key))
    .forEach((key) => resUser[key] = user[key]);
  resUser['email'] = cryptography.decrypt(resUser['email']);

  const answer = JSON.stringify({ type: 'user', method: 'set', data: resUser });
  
  sendMessages(objDuct.current.array.map((client) => client.socket), [answer]);
}

module.exports = userHandler;

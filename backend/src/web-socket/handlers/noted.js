const sendMessages = require('../func/sendMessages');
const removeNotedItems = require('../func/removeNotedItems');
const User = require('../../models/User');

const valuesNotedType = ['task', 'project'];

async function notedHandler(method, data, objDuct) {
  switch (method) {
    case 'add':
      const answerAdded = JSON.stringify({type: 'noted', method: 'get', data: [await addNotedItem(data)]});
      sendMessages(objDuct.current.array.map((client) => client.socket), [answerAdded]);
      break;
    case 'remove':
      await removeNotedItem(data, objDuct);
      break;
    default:
      throw new Error('Method value is wrong in type noted');
  }
}

async function addNotedItem(data) {
  if (typeof data.itemId !== 'string') throw new Error('Property id is of the wrong type');
  if (valuesNotedType.indexOf(data.type) < 0) throw new Error('Property type have wrong value');

  const user = await User.findOne({ _id: data._id });
  if (!user) throw new Error('Not found user');

  user.notedItems.push({
    _id: data.itemId,
    type: data.type
  });

  await user.save();

  return user.notedItems[user.notedItems.length - 1];
}

async function removeNotedItem(data, objDuct) {
  await removeNotedItems(objDuct, [data.itemId], [data._id]);
}

module.exports = notedHandler;

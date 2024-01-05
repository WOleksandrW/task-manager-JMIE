const removeNoted = require('../../utils/removeNoted');
const sendMessages = require('./sendMessages');

async function removeNotedItems(objDuct, items, users) {
  const result = await removeNoted(items, users);

  Object.keys(result).forEach((key) => {
    if (objDuct.all[key]) {
      const itemIds = result[key].map((item) => item._id);
      if (itemIds.length > 0) {
        const message = JSON.stringify({type: 'noted', method: 'delete', data: itemIds});
        sendMessages(objDuct.all[key].map((client) => client.socket), [message]);
      }
    }
  });
}

module.exports = removeNotedItems;

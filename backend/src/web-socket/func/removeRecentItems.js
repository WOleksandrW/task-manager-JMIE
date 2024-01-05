const removeRecent = require('../../utils/removeRecent');
const sendMessages = require('./sendMessages');

async function removeRecentItems(objDuct, items, users) {
  const result = await removeRecent(items, users);

  Object.keys(result).forEach((key) => {
    if (objDuct.all[key]) {
      const message = JSON.stringify({type: 'recent', method: 'set', data: result[key]});
      sendMessages(objDuct.all[key].map((client) => client.socket), [message]);
    }
  });
}

module.exports = removeRecentItems;

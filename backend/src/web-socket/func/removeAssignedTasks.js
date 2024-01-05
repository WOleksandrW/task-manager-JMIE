const sendMessages = require('./sendMessages');

async function removeAssignedTasks(objDuct, tasks, users) {
  let usersIds = [];

  if (users) {
    usersIds = users;
  } else {
    usersIds = Array.from(new Set(tasks.map((task) => task.executor)))
      .filter((user) => user !== 'auto');
  }

  usersIds.forEach((user) => {
    if (objDuct.all[user]) {
      const tempArr = tasks.filter((task) => task.executor === user).map((task) => task._id);
      if (tempArr.length > 0) {
        const message = JSON.stringify({type: 'assigned', method: 'delete', data: tempArr});
        sendMessages(objDuct.all[user].map((client) => client.socket), [message]);
      }
    }
  });
}

module.exports = removeAssignedTasks;

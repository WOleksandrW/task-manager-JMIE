const User = require('../models/User');

async function removeNoted(notedList, userIdList) {
  let users = [];
  if (userIdList) {
    const tempArr = userIdList.map(async (_id) => {
      const user = await User.findById(_id);
      if (!user) throw new Error('Not found user');
      return user;
    });
    users = await Promise.all(tempArr);
  } else users = (await User.find({})).filter((user) => user.notedItems.some((noted) => notedList.includes(noted._id.toString())));

  const result = {};

  for (let i = 0; i < users.length; i++) {
    result[users[i]._id] = users[i].notedItems.filter((noted) => notedList.includes(noted._id.toString()));
    users[i].notedItems = users[i].notedItems.filter((noted) => !notedList.includes(noted._id.toString()));
    await users[i].save();
  }

  return result;
}

module.exports = removeNoted;
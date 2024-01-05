const User = require('../models/User');

async function removeRecent(recentList, userIdList) {
  let users = [];
  if (userIdList) {
    const tempArr = userIdList.map(async (_id) => {
      const user = await User.findById(_id);
      if (!user) throw new Error('Not found user');
      return user;
    });
    users = await Promise.all(tempArr);
  } else users = (await User.find({})).filter((user) => user.recentProjects.some((data) => recentList.includes(data.toString())));

  const result = {};

  for (let i = 0; i < users.length; i++) {
    users[i].recentProjects = users[i].recentProjects.filter((data) => !recentList.includes(data.toString()));
    result[users[i]._id] = users[i].recentProjects;
    await users[i].save();
  }

  return result;
}

module.exports = removeRecent;
const bcrypt = require("bcryptjs");

const getUserByEmail = (users, email) => {
  const userList = Object.values(users);

  const user = userList.find((user) => email === user.email);

  return user;
};

const authenticateUser = (users, email, password) => {
  const user = getUserByEmail(users, email);

  if (!user) {
    return { error: "User doesn't exist", user: undefined };
  }

  //if (user.password !== password) {
  if (!bcrypt.compareSync(password, user.password)) {
    return { error: "Password doesn't match", user: undefined };
  }

  return { error: undefined, user };
};

const urlsForUser = (urls, id) => {
  const keys = Object.keys(urls);
  const result = {};

  for (let key of keys) {
    if (urls[key].userID === id) {
      result[key] = urls[key];
    }
  }
  return result;
};

module.exports = {getUserByEmail, authenticateUser, urlsForUser};
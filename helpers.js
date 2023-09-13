const bcrypt = require("bcryptjs");

const getUserByEmail = (users, email) => {
  const userList = Object.values(users);

  const user = userList.find((user) => email === user.email);

  return user;
};

const authenticateUser = (users, email, password) => {
  const user = getUserByEmail(users, email);

  if (!user) {
    return { error: "User doesn't exist\n", user: undefined };
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return { error: "Password doesn't match\n", user: undefined };
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

const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
};

const checkUrlId = (urls, id) => {
  for (let url in urls) {
    if (url === id) {
      return true;
    }
  }

  return false;
};

const userURL = (url, userID) => {
  return url.userID === userID;
};

module.exports = {getUserByEmail, authenticateUser, urlsForUser, generateRandomString, checkUrlId, userURL};
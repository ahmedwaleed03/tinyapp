const bcrypt = require("bcryptjs");

const getUserByEmail = (users, email) => {
  let tempUser = undefined;
  for (let user in users) {
    if (users[user].email === email) {
      tempUser = users[user];
    }
  }
  return tempUser;
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
  let result = {};
  
  for (let url in urls) {
    if (urls[url].userID === id) {
      result[url] = urls[url];
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
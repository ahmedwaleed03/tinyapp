const bcrypt = require("bcryptjs");

// passwords for the two default accounts
const pass1 = "purple-monkey-dinosaur";
const pass2 = "dishwasher-funk";

// object that stores the users
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync(pass1, 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync(pass2, 10)
  },
};

// object that contains the urls
const urlDatabase = {
  "b2xVn2": {
    longURL:"http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};

module.exports = {users, urlDatabase};
const cookieSession = require('cookie-session');
const express = require("express");
const bcrypt = require("bcryptjs");
const { getUserByEmail, authenticateUser, urlsForUser, generateRandomString } = require("./helpers");
const { users, urlDatabase } = require("./data");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'user', // what the session is called on the clients browser
  keys: ['one', 'two', 'three'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// routes
app.get("/", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  } else {
    return res.redirect("/urls");
  }
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(urlDatabase, req.session.user_id),
    user: users[req.session.user_id],
  };

  return res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.send("Error! You need to be logged in to create a short url!\n");
  }
  let id = generateRandomString();
  let tempURL = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };

  urlDatabase[id] = tempURL;
  return res.redirect("/urls/" + id);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.user_id], };
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  return res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.send("Error! You need to be logged in to view/edit a short url!\n");
  }
  const templateVars = {
    id: req.params.id,
    url: urlDatabase[req.params.id],
    user: users[req.session.user_id],
  };

  if (req.session.user_id !== templateVars.url.userID) {
    return res.send("Error! This url does not belong to you!\n");
  }

  return res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.send("Error! You need to be logged in to edit a url!\n");
  }
  const { id } = req.params;
  if (!urlDatabase[id]) {
    return res.send("Error! URL does not exist!\n");
  }
  urlDatabase[id].longURL = req.body.longURL;
  return res.redirect(`/urls`);
});

app.get("/u/:id", (req, res) => {
  const { id } = req.params;
  const longURL = urlDatabase[id].longURL;
  if (!longURL) {
    return res.send("URL does not exist!\n");
  }
  return res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  if (!req.session.user_id) {
    return res.send("Error! You need to be logged in to delete a url!\n");
  }
  const { id } = req.params;
  if (!urlDatabase[id]) {
    return res.send("Error! URL does not exist!\n");
  }
  delete urlDatabase[id];
  return res.redirect("/");
});

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.user_id]};
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  return res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  const {email, password} = req.body;
  if (email === "" || password === "") {
    res.status(400);
    return res.send("Please complete both fields!");
  } else if (getUserByEmail(users, email)) {
    res.status(400);
    return res.send("Email is already registered!");
  }

  let newId = generateRandomString();
  let newUser = {
    id: newId,
    email,
    password : bcrypt.hashSync(password, 10)
  };
  users[newId] = newUser;
  req.session.user_id = newId;
  return res.redirect("/");
});

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.session.user_id],};
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  return res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const { error, user } = authenticateUser(users, email, password);
  if (error) {
    res.status(403);
    return res.send(error);
  }

  req.session.user_id = user.id;
  return res.redirect("/");
});

app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
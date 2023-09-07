const cookieParser = require('cookie-parser')
const express = require("express");
const { findUserByEmail, authenticateUser } = require("./helpers");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  return res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  return res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]], };
  if (!req.cookies["user_id"]) {
    return res.redirect("/login");
  }
  return res.render("urls_new", templateVars);
});

app.post("/register", (req, res) => {
  const {email, password} = req.body;
  if (email === "" || password === "") {
    res.status(400);
    return res.redirect("/register");
  } else if (findUserByEmail(users, email)) {
    res.status(400);
    return res.redirect("/register");
  }

  let newId = generateRandomString();
  let newUser = {
    id: newId,
    email,
    password
  };
  users[newId] = newUser;
  res.cookie("user_id", newId);
  return res.redirect("/");
});

app.post("/urls", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.send("Error! You need to be logged in to create a short url!\n");
  }
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  return res.redirect("/urls/" + id); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:id", (req, res) => {
  const { id } = req.params;
  const longURL = urlDatabase[id];
  return res.redirect(longURL);
});


app.post("/urls/:id/delete", (req, res) => {
  const { id } = req.params;
  delete urlDatabase[id];
  return res.redirect("/");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id], 
    user: users[req.cookies["user_id"]],
  };
  return res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]]};
  if (req.cookies["user_id"]) {
    return res.redirect("/urls");
  }
  return res.render("registration", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const { id } = req.params;
  urlDatabase[id] = req.body.longURL;
  return res.redirect(`/urls/${id}`);
});

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]],};
  if (req.cookies["user_id"]) {
    return res.redirect("/urls");
  }
  return res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const { error, user } = authenticateUser(users, email, password);
  if (error) {
    return res.status(403);
  }

  res.cookie("user_id", user.id);
  return res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  return res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  return res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
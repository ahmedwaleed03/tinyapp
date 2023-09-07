const findUserByEmail = (users, email) => {
  const userList = Object.values(users);

  const user = userList.find((user) => email === user.email);

  return user;
};

const authenticateUser = (users, email, password) => {
  const user = findUserByEmail(users, email);

  if (!user) {
    return { error: "User doesn't exist", user: undefined };
  }

  if (user.password !== password) {
    return { error: "Password doesn't match", user: undefined };
  }

  return { error: undefined, user };
};

module.exports = {findUserByEmail, authenticateUser};
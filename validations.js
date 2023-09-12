const validateUsername = (username) => {
  const regex = /^([a-zA-Z ]){2,30}$/;
  return regex.test(username);
}

const validatePassword = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  return regex.test(password);
}

const validateEmail = (email) => {
  const regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return regex.test(email);
}

module.exports = { validateUsername, validatePassword, validateEmail }
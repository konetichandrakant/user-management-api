const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { validateUsername, validatePassword, validateEmail } = require('./validations');
const pool = require('./connection');
require('dotenv').config();

router.get('/', (req, res) => {
  const query = 'SELECT * FROM ostello.users';
  pool.query(query, (queryErr, results) => {
    if (queryErr)
      return res.status(500);

    if (results.length === 0)
      return res.status(200).send('No users');

    return res.status(200).send(results);
  });
})

router.post('/', (req, res) => {
  const { username, password, email } = req.body;

  if (!validateUsername(username) || !validatePassword(password) || !validateEmail(email))
    return res.status(400).send('validation error send username,password,email in correct format');

  const hashedPassword = jwt.sign(password, process.env.SECRET_KEY);

  const query = `INSERT INTO ostello.users (username, userkey, email)
  SELECT ?, ?, ?
  FROM dual
  WHERE NOT EXISTS (SELECT 1 FROM ostello.users WHERE email = ?);`;

  pool.query(query, [username, hashedPassword, email, email], (queryErr, results) => {
    if (queryErr)
      return res.status(500).send('error while creating, pass all required fields i.e. username,password,email with case sentitive in body of request');
    
    if (results.affectedRows === 0)
      return res.status(500).send('error while creating, email already exists');

    return res.status(200).send('created successfully');
  });
})

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM ostello.users WHERE id=${id}`

  pool.query(query, (queryErr, results) => {
    if (queryErr)
      return res.status(500);

    if (results.length === 0)
      return res.status(500).send('cant get as there is no user with mentioned ID');

    return res.status(200).send(results);
  })
})

router.put('/:id', (req, res) => {
  const { id } = req.params;

  const { username, password, email } = req.body;

  if (!validateUsername(username) || !validatePassword(password) || !validateEmail(email))
    return res.status(400).send('validation error send username,password,email in correct format');

  const hashedPassword = jwt.sign(password, process.env.SECRET_KEY);

  const query = `UPDATE ostello.users 
    SET username=?, userkey=?, email=?
    WHERE id=${id}`;

  pool.query(query, [username, hashedPassword, email], (queryErr, results) => {
    if (queryErr)
      return res.status(500);

    if (results.changedRows === 0)
      return res.status(500).send('cant update as there is no user with mentioned ID');

    return res.status(200).send('updated successfully');
  })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM ostello.users WHERE id=${id}`;
  pool.query(query, (err, results) => {
    if (err)
      return res.status(500);

    if (results.changedRows === 0)
      return res.status(500).send('cant delete as there is no user with mentioned ID');

    return res.status(200).send('deleted succcessfully');
  })
})

module.exports = router;
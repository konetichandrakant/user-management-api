const express = require('express');
const app = express();

require('dotenv').config();

app.use(express.json());

const PORT = process.env.PORT;

const routes = require('./routes');

app.use('/api/users', routes);

app.all('*', (req, res) => {
  return res.status(404).send('page not found');
})

app.listen(PORT)
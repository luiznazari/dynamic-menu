const express = require('express');
const cors = require('cors');
const setupDatabase = require('./config/db-config');

const app = express();

const corsOptions = {
  origin: '*'
};

app.disable('etag');
app.use(express.json());
app.use(cors(corsOptions));

require('./route')(app);

setupDatabase();

module.exports = app;

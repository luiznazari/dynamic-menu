const mongoose = require('mongoose');
const LogEvent = require('../utils/log-event');
const environmentProvider = require('./environment-provider');

mongoose.Promise = global.Promise;

function setupDatabase() {
  return mongoose.connect(environmentProvider.get('MONGODB_URL'), {
    authSource: environmentProvider.get('MONGODB_AUTH_SOURCE'),
    auth: {
      username: environmentProvider.get('MONGODB_USERNAME'),
      password: environmentProvider.get('MONGODB_PASSWORD')
    }
  })
    .then(() => {
      LogEvent.debug('Connected to the MongoDB server!').log();
    })
    .catch(err => {
      LogEvent.error('Error connecting to MongoDB server!').log();
      LogEvent.error(err).log();
      process.exit();
    });
}

module.exports = setupDatabase;

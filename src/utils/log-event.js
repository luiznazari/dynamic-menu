const LOG_LEVEL = require('../domain/enum/log-level');
const LogObjectSchema = require('../domain/schema/log-object');
const environmentProvider = require('../config/environment-provider');

const CONSOLE_COLOR_RED = '\x1b[31m%s\x1b[0m';
const CONSOLE_COLOR_BOLD_RED = '\x1b[31;1m%s\x1b[0m';
const CONSOLE_COLOR_YELLOW = '\x1b[33m%s\x1b[0m';
const isDevelopment = environmentProvider.get('NODE_ENV', 'development');

class BeautifulLogEvent {

  constructor(logLevel, message) {
    this.logLevel = logLevel;
    this.message = message;
    if (this.message instanceof Error) {
      this.message = message.message;
      this.stack = message.stack;
    } else {
      this.message = message;
    }
  }

  log() {
    const logObject = new LogObjectSchema(this.logLevel, this.message, this.stack);

    const logMessage = JSON.stringify(logObject);

    if (LOG_LEVEL.ERROR === this.logLevel) {
      this.#logError(logMessage);

    } else if (LOG_LEVEL.WARN === this.logLevel) {
      console.warn(CONSOLE_COLOR_YELLOW, logMessage);

    } else {
      console.log(logMessage);
    }
  }

  #logError(logMessage) {
    console.error(CONSOLE_COLOR_RED, logMessage);

    if (isDevelopment && this.stack) {
      console.error(CONSOLE_COLOR_BOLD_RED, this.stack);
    }
  }

}

const LogEvent = {

  info: (message) => {
    return new BeautifulLogEvent(LOG_LEVEL.INFO, message);
  },

  warn: (message) => {
    return new BeautifulLogEvent(LOG_LEVEL.WARN, message);
  },

  error: (message) => {
    return new BeautifulLogEvent(LOG_LEVEL.ERROR, message);
  },

  debug: (message) => {
    return new BeautifulLogEvent(LOG_LEVEL.DEBUG, message);
  }

};

module.exports = LogEvent;
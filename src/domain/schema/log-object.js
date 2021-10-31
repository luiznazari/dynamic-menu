class LogObjectSchema {
  constructor(logLevel, message, stack) {
    this.log_level = logLevel;
    this.message = message;
    this.stack = this.#truncate(stack, 1024);
  }

  #truncate(text, maxLength) {
    return typeof text === 'string' ? text.substring(0, maxLength) : text;
  }
}

module.exports = LogObjectSchema;

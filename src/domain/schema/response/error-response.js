class ErrorSchema {
  constructor(message, errorCode, details) {
    this.message = message;
    this.error_code = errorCode;
    this.details = details;
  }
}

module.exports = ErrorSchema;

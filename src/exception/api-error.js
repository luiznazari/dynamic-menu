const HTTP_STATUS = require('../domain/enum/http-status');

class ApiError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errorName = 'ApiError') {
    super(`${errorName}: ${message}`);
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;

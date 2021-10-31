const HTTP_STATUS = require('../enum/http-status');
const ApiError = require('./api-error');

class BusinessError extends ApiError {
  constructor(message, statusCode = HTTP_STATUS.BAD_REQUEST) {
    super(message, statusCode, 'BusinessError');
  }
}

module.exports = BusinessError;

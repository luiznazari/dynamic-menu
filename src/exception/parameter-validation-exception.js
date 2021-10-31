const ApiError = require('./api-error');
const HTTP_STATUS = require('../enum/http-status');

class ParameterValidationError extends ApiError {
  constructor(message, statusCode = HTTP_STATUS.BAD_REQUEST) {
    super(message, statusCode, 'ParameterValidationError');
  }
}

module.exports = ParameterValidationError;

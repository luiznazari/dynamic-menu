const ApiError = require('./api-error');
const HTTP_STATUS = require('../domain/enum/http-status');

const VALIDATOR_ERROR_MESSAGE = 'There was schema validation errors!';

class SchemaValidationError extends ApiError {
  constructor(error) {
    super(VALIDATOR_ERROR_MESSAGE, HTTP_STATUS.BAD_REQUEST, 'SchemaValidationError');
    this.message = VALIDATOR_ERROR_MESSAGE;
    this.details = this.#getValidationErrorDetails(error.details);
  }

  #getValidationErrorDetails(errorDetails) {
    if (errorDetails && Array.isArray(errorDetails)) {
      return errorDetails.map(detail => detail.message);
    }

    return VALIDATOR_ERROR_MESSAGE;
  }
}

module.exports = SchemaValidationError;

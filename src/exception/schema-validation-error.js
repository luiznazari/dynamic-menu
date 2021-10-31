const ApiError = require('./api-error');
const HTTP_STATUS = require('../enum/http-status');

const VALIDATOR_ERROR_MESSAGE = 'There was schema validation errors!';

class SchemaValidationError extends ApiError {
  constructor(errDetails) {
    super(VALIDATOR_ERROR_MESSAGE, HTTP_STATUS.BAD_REQUEST, 'SchemaValidationError');
    this.message = VALIDATOR_ERROR_MESSAGE;
    this.details = this.#getValidationErrorDetails(errDetails);
  }

  #getValidationErrorDetails(errDetails) {
    if (errDetails && Array.isArray(errDetails)) {
      return errDetails.map(detail => detail.message);
    }

    return VALIDATOR_ERROR_MESSAGE;
  }
}

module.exports = SchemaValidationError;

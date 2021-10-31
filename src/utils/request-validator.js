const mongoose = require('mongoose');
const ParameterValidationError = require('../exception/parameter-validation-exception');
const LogEvent = require('./log-event');

const Validators = {
  validObjectId: value => {
    if (typeof value !== 'string' || !mongoose.Types.ObjectId.isValid(value)) {
      return 'is not a valid ObjectId';
    }
    return null;
  }
};

const RequestValidator  = {
  /**
   * @param {Object} req - the original request
   * @param {Object[]} validators - the parameter validators
   * @param {string} validators [0] - the parameter name to be validated
   * @param {function} validators [1] - the validation function
   */
  validateParameters: (req, validators) => {
    validators.forEach(validator => {
      const param = validator[0];
      const validationFunction = validator[1];
      
      if (typeof req.params[param] === 'undefined') {
        LogEvent.warn(`No parameter declared with the name '${param}'. Skipping parameter validation.`);
        return;
      }
      
      const paramValue = req.params[param];
      const validationError = validationFunction(paramValue);

      if (validationError) {
        throw new ParameterValidationError(`The parameter '${param}' ${validationError}!`);
      }
    });
  }

}

module.exports = {
  RequestValidator,
  Validators
};

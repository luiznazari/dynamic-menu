const Joi = require('joi');
const mongoose = require('mongoose');
const SchemaValidatiorError = require('../exception/schema-validation-error');

const DEFAULT_JOI_OPTIONS = { locale: 'en' };

const Validators = {
  validObjectId: (value, helper, fieldName) => {
    if (typeof value !== 'string' || !mongoose.Types.ObjectId.isValid(value)) {
      return helper.message(`"${fieldName}" is not a valid ObjectId.`);
    }
    return true;
  }
};

class SchemaValidator {
  constructor(schema) {
    this.schema = schema;
  }

  validate(requestBody) {
    const validationResult = this.schema.validate(requestBody, DEFAULT_JOI_OPTIONS);
    if (validationResult.error) {
      throw new SchemaValidatiorError(validationResult.error);
    }
  }
}

module.exports = {
  Validators,
  SchemaValidator,
};

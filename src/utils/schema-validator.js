const Joi = require('joi');
const SchemaValidatiorException = require('../configuration/exception/validation/schema-validation-exception');

const DEFAULT_JOI_OPTIONS = { locale: 'en' };

class SchemaValidator {
  constructor(schema) {
    this.schema = schema;
  }

  validate(requestBody) {
    Joi.validate(requestBody, this.schema, DEFAULT_JOI_OPTIONS, (err /*, value */) => {
      if (err) {
        throw new SchemaValidatiorException(err.details);
      }
    });

    return requestBody;
  }
}

module.exports = SchemaValidator;

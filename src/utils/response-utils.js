const ErrorResponseSchema = require('../domain/schema/response/error-response');
const HTTP_STATUS = require('../domain/enum/http-status');

const ResponseUtils = {
  ok: (res, data) => {
    return res.status(HTTP_STATUS.OK).json(data);
  },

  created: (res, data) => {
    return res.status(HTTP_STATUS.CREATED).json(data);
  },

  noContent: (res) => {
    return res.status(HTTP_STATUS.NO_CONTENT).send({});
  },

  error: (res, err) => {
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const response = new ErrorResponseSchema(err.message, statusCode, err.details);
    return res.status(statusCode).json(response);
  },

}

module.exports = ResponseUtils;

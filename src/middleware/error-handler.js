const {
  getResponseMessage,
  sendError,
} = require('../utils/response/response-utils.js');

const errorHandler = (err, req, res, next) => {
  console.log(err, 'error');

  if (err && err.error && err.error.isJoi) {
    err.message = err.error.details[0].message.replace(/\"/g, '') || 'error';
    err.statusCode = 400;
  } else {
    console.log(err.message, 'message');
    err.message = getResponseMessage(err.message);
  }
  return sendError(err, req, res);
};

module.exports = errorHandler;

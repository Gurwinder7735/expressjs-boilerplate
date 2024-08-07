const sendSuccess = (req, res, status, message, data) => {
  return res.status(status).json({
    success: true,
    status: status || 200,
    message: getResponseMessage(message, req.headers.lang),
    data: data || {},
  });
};

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    status: err.statusCode || 500,
    message:
      typeof err === 'string'
        ? err
        : getResponseMessage(err.message, req.headers.lang),
    data: {},
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    message: 'something went wrong!',
    data: {},
  });
};

const sendError = (err, req, res) => {
  // if (['development', 'test'].includes(process.env.NODE_ENV || '')) {
  return sendErrorDev(err, req, res);
  // } else if (process.env.NODE_ENV === 'production') {
  // return sendErrorProd(err, req, res);
  // }
};

const getResponseMessage = (msg, lang) => {
  if (typeof msg === 'object') {
    return (msg.message && msg.message[lang || 'en']) || msg[lang || 'en'];
  }
  return msg;
};

module.exports = {
  sendSuccess,
  sendErrorDev,
  sendErrorProd,
  sendError,
  getResponseMessage,
};

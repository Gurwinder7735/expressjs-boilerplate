class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message
    this.statusCode = statusCode;
    this.success = false;
    this.isOperational = true;

    // Ensure 'Error' captures the stack trace properly
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

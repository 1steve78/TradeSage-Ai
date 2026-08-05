class AppError extends Error {
  constructor(message, statusCode, errorCode = "INTERNAL_ERROR") {
    super(message);
    
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Identifies known/expected errors (vs bugs)

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

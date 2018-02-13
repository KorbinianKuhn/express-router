class NotFoundError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'NotFoundError';
    this.details = details;
  }
}

exports.NotFoundError = NotFoundError;

class MethodNotAllowedError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'MethodNotAllowedError';
    this.details = details;
  }
}

exports.MethodNotAllowedError = MethodNotAllowedError;

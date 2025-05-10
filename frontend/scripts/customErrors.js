export class HttpError extends Error {
  constructor(status, message) {
    super(`HTTP ${status}: ${message}`);
    this.name = "HttpError";
    this.status = status;
    this.message = message;
  }
}

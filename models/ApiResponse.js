module.exports = class ApiResponse {
  constructor(message, success, statusCode, data) {
    this.message = message;
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
  }
};

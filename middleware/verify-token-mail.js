const jwt = require("jsonwebtoken");

//Models
const ApiResponse = require("../models/ApiResponse");

module.exports = (req, res, next) => {
  const token =
    req.headers["x-access-token"] || req.body.token || req.query.token ;

  let apiResponse = new ApiResponse();

  if (token) {
    jwt.verify(token, req.app.get("api_mail_key"), (err, decoded) => {
      if (err) {
        apiResponse.message = "Failed to mail token.";
        apiResponse.success = false;
        apiResponse.statusCode = 0;
        res.json(apiResponse);
      } else {
        req.decoded = decoded;
        req.token = token;
        next();
      }
    });
  } else {
    apiResponse.message = "No token provided.";
    apiResponse.success = false;
    apiResponse.statusCode = 0;
    res.json(apiResponse);
  }
};

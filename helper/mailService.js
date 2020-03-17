const nodeMailer = require("nodemailer");

module.exports = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "zigo.node.js.api@gmail.com",
    pass: "God.1234"
  }
});

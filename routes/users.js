const express = require("express");
const router = express.Router();
const mailService = require("../helper/mailService");
const jwt = require("jsonwebtoken");

//Models
const ApiResponse = require("../models/ApiResponse");
const User = require("../models/User");

//getUserProfile
router.get("/", (req, res, next) => {
  const { username } = req.decoded;

  User.findOne({ username }, (err, data) => {
    if (err) throw err;

    if (!data) {
      let apiResponse = new ApiResponse(
        "Authenticate failed, user not found.",
        false,
        15
      );
      res.json(apiResponse);
    } else {
      if (data.username === username) {
        let apiResponse = new ApiResponse(
          "Authenticate success.",
          true,
          16,
          data
        );
        res.json(apiResponse);
      }
    }
  });
});

//Update
router.put("/", (req, res, next) => {
  const { username } = req.decoded;

  User.findOne({ username }, (err, data) => {
    if (err) throw err;

    if (!data) {
      let apiResponse = new ApiResponse(
        "Authenticate failed, user not found.",
        false,
        15
      );
      res.json(apiResponse);
    } else {
      const promise = User.findByIdAndUpdate(data._id, req.body, {
        new: true
      });

      promise
        .then(data => {
          let apiResponse = new ApiResponse(
            "User update success.",
            true,
            17,
            data
          );
          res.json(apiResponse);
        })
        .catch(err => {
          let apiResponse = new ApiResponse("User update fail.", false, 18);
          res.json(apiResponse);
        });
    }
  });
});

//Delete
router.delete("/", (req, res, next) => {
  const { username } = req.decoded;

  User.findOne({ username }, (err, data) => {
    if (err) throw err;

    if (!data) {
      let apiResponse = new ApiResponse(
        "Authenticate failed, user not found.",
        false,
        15
      );
      res.json(apiResponse);
    } else {
      const promise = User.findByIdAndRemove(data._id);
      promise
        .then(data => {
          let apiResponse = new ApiResponse("User delete success.", true, 19);
          res.json(apiResponse);
        })
        .catch(err => {
          let apiResponse = new ApiResponse("User delete fail.", false, 20);
          res.json(apiResponse);
        });
    }
  });
});

//ForgotToPassword
router.get("/forgotPass", (req, res, next) => {
  const { username } = req.decoded;

  User.findOne({ username }, (err, data) => {
    if (err) throw err;

    if (!data) {
      let apiResponse = new ApiResponse(
        "Authenticate failed, user not found.",
        false,
        15
      );
      res.json(apiResponse);
    } else {
      const payload = {
        username
      };
      const token = jwt.sign(payload, req.app.get("api_mail_key"), {
        expiresIn: 5 //12 saat
      });

      const mailOptions = {
        from: "sender@email.com", // sender address
        to: data.email, // list of receivers
        subject: "Reset your account password", // Subject line
        html: req.app.get("client_url") + "/resetPass?token=" + token
      };

      mailService.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        let apiResponse = new ApiResponse("Check your mailbox.", true, 24);
        res.json(apiResponse);
      });
    }
  });
});

module.exports = router;

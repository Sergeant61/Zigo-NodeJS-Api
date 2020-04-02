const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Error Parser
const errorParser = require("../error-helper/errorParser");

//Models
const ApiResponse = require("../models/ApiResponse");
const User = require("../models/User");

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne(
    {
      username
    },
    (err, data) => {
      if (err) throw err;

      if (!data) {
        let apiResponse = new ApiResponse(
          "Login failed, user not found.",
          false,
          10
        );
        res.json(apiResponse);
      } else {
        bcrypt.compare(password, data.password).then(result => {
          if (!result) {
            let apiResponse = new ApiResponse(
              "Login failed, wrong password.",
              false,
              11
            );
            res.json(apiResponse);
          } else {
            const payload = {
              username
            };
            const token = jwt.sign(payload, req.app.get("api_secret_key"), {
              expiresIn: "12h" //12 saat
            });

            let apiResponse = new ApiResponse("Login success.", true, 12, {
              token: token
            });
            res.json(apiResponse);
          }
        });
      }
    }
  );
});

//register
router.post("/register", (req, res, next) => {
  const newUser = new User(req.body);

  bcrypt.hash(newUser.password, 10).then(hash => {
    newUser.password = hash;

    const promise = newUser.save();
    promise
      .then(data => {
        let apiResponse = new ApiResponse(
          "The user has been created.",
          true,
          13,
          null
        );
        res.json(apiResponse);
      })
      .catch(err => {
        let apiResponse = new ApiResponse(errorParser(err), false, 14);
        res.json(apiResponse);
      });
  });
});

//register
router.get("/resetPass", (req, res, next) => {
  res.render("reset-password", { params: { token: req.token } });
});

//UpdatePass
router.post("/updatePass", (req, res, next) => {
  const { username } = req.decoded;
  const { password, password2 } = req.body;

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
      if (password === password2) {
        bcrypt
          .hash(password, 10)
          .then(hash => {
            const promise = User.findByIdAndUpdate(data._id, {
              password: hash
            });
            promise
              .then(data => {
                res.render("congratulations");
              })
              .catch(err => {
                res.render("error");
              });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        res.render("error");
      }
    }
  });
});


//Angular deneme için yazılmış routerlar

router.get("/users", (req, res, next) => {
  const promise = User.find({})
   
  promise
    .then(data => {
      res.status(200);
      res.json(data);
    })
    .catch(err => {      res.status(200);

      res.json(err);
    });
  
});

module.exports = router;

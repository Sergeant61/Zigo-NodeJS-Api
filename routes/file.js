const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const uniqid = require("uniqid");
const router = express.Router();
const multer = require("multer");
const path = require("path");

//MulterConfig
const storage = require("../helper/multerConfig");
const upload = multer({ storage });

//Models
const ApiResponse = require("../models/ApiResponse");
const User = require("../models/User");
const File = require("../models/File");

//Upload file
router.post("/", upload.single("file"), (req, res, next) => {
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
      const newFile = File(req.file);
      newFile.creator_user_id = data._id;
      const promise = newFile.save();

      promise
        .then(date => {
          let apiResponse = new ApiResponse("File save.", true, 25, newFile);
          res.json(apiResponse);
        })
        .catch(err => {
          let apiResponse = new ApiResponse("File not save.", false, 26);
          res.json(apiResponse);
        });
    }
  });
});

//Upload files
// router.post("/uploadMulti", upload.array("files"), (req, res, next) => {
//   const { username } = req.decoded;

//   User.findOne({ username }, (err, data) => {
//     if (err) throw err;

//     if (!data) {
//       let apiResponse = new ApiResponse(
//         "Authenticate failed, user not found.",
//         false,
//         15
//       );

//       res.json(apiResponse);
//     } else {
//       const newFile = File(req.file);
//       newFile.creator_user_id = data._id;
//       const promise = newFile.save();

//       promise
//         .then(date => {
//           newFile.finalImg = null;
//           let apiResponse = new ApiResponse("File save.", true, 14, newFile);
//           res.json(apiResponse);
//         })
//         .catch(err => {
//           let apiResponse = new ApiResponse("File not save.", false, 14);
//           res.json(apiResponse);
//         });
//     }
//   });
// });

//Dowland file
router.get("/:file_id", (req, res, next) => {
  const { username } = req.decoded;
  const file_id = req.params.file_id;
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
      File.aggregate(
        [
          {
            $match: {
              _id: mongoose.Types.ObjectId(file_id)
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "creator_user_id",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              _id: {
                _id: "$_id",
                path: "$path",
                creator_user_id: "$creator_user_id",
                access: "$access"
              },
              user: {
                $push: "$user"
              }
            }
          },
          {
            $project: {
              _id: "$_id._id",
              path: "$_id.path",
              creator_user_id: "$_id.creator_user_id",
              access: "$_id.access",
              user: {
                name: 1,
                surname: 1,
                username: 1,
                profilAccess: 1
              }
            }
          }
        ],
        (err, getFileList) => {
          const getFile = getFileList[0];
          const hasFileUser = new User(getFile.user[0]);
          //console.log(getFile, hasFileUser);

          if (hasFileUser.profilAccess) {
            // Kullanıcı açık hesap ise
            if (getFile.access) {
              //Dosya okumaya açık ise
              const file = fs.readFileSync(
                path.dirname(__dirname) + "\\" + getFile.path
              );
              res.contentType("image/jpeg");
              res.send(Buffer.from(file));
            } else {
              //Dosya okumaya kapalı ise
              if (data._id === getFile.creator_user_id) {
                //Dosyayı oluşturan istek yapan user ise
                const file = fs.readFileSync(
                  path.dirname(__dirname) + "\\" + getFile.path
                );
                res.contentType("image/jpeg");
                res.send(Buffer.from(file));
              } else {
                //Dosyayı oluşturan başka bir user ise
                accessNotFound(res);
              }
            }
          } else {
            // Kullanıcı kapalı hesap ise
            if (data._id === getFile.creator_user_id) {
              //Dosyayı oluşturan istek yapan user ise
              const file = fs.readFileSync(
                path.dirname(__dirname) + "\\" + getFile.path
              );
              res.contentType("image/jpeg");
              res.send(Buffer.from(file));
            } else {
              //Dosyayı oluşturan başka bir user ise
              accessNotFound(res);
            }
          }
        }
      );
    }
  });
});

const accessNotFound = res => {
  let apiResponse = new ApiResponse("Access not found.", false, 27, null);
  res.json(apiResponse);
};

//Delete file
router.delete("/:file_id", (req, res, next) => {
  const { username } = req.decoded;
  const file_id = req.params.file_id;

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
      File.findById(file_id, (err, getFile) => {
        if (data._id === getFile.creator_user_id) {
          const promise = File.findByIdAndRemove(file_id);
          promise
            .then(data => {
              const file = fs.unlinkSync(
                path.dirname(__dirname) + "\\" + getFile.path
              );

              file
                .then(data => {
                  let apiResponse = new ApiResponse(
                    "File delete.",
                    true,
                    28,
                    newFile
                  );
                  res.json(apiResponse);
                })
                .catch(err => {});
            })
            .catch(err => {
              let apiResponse = new ApiResponse(
                "File not delete.",
                false,
                29,
                newFile
              );
              res.json(apiResponse);
            });
        } else {
          accessNotFound(res);
        }
      });
    }
  });
});

module.exports = router;

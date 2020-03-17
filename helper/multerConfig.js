const multer = require("multer");
const path = require("path");
const uniqid = require("uniqid");


module.exports = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "./storage/files/";
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.split(".")[0]; //resim.png  -> resim [0] , png [1]
    cb(
      null,
      filename + "_" + uniqid("file-") + path.extname(file.originalname)
    );
  }
});

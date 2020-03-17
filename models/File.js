const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: String,
  creator_user_id: Schema.Types.ObjectId,
  finalImg: Object,

  access: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("file", FileSchema);

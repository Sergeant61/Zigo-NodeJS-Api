const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  surname: {
    type: String,
    required: true,
    minlength: 3
  },
  username: {
    type: String,
    required: true,
    minlength: 5,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  birthDate: {
    type: String
  },
  sex: {
    type: Boolean
  },
  ppImageId: {
    type: Schema.Types.ObjectId
  },
  profilAccess: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("user", UserSchema);

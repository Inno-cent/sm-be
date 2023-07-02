const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fullname: String,
  email: String,
  password: String,
  phoneNumber: String,
  address: String,
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Users", userSchema);

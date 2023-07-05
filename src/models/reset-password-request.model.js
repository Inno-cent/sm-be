const { Schema, model } = require("mongoose");

const resetPasswordRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  token: String,
});

module.exports = model("ResetPasswordRequests", resetPasswordRequestSchema);

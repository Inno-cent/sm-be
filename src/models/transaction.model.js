const { Schema, model } = require("mongoose");

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = model("Transactions", transactionSchema);

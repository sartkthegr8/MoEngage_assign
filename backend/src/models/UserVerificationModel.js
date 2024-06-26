const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
  userId: String,
  uniqueId: String,
  createdAt: Date,
  expiresAt: Date,
});

const UsersVerifications =
  mongoose.models.UsersVerifications ||
  mongoose.model("UsersVerifications", UserVerificationSchema);

module.exports = UsersVerifications;

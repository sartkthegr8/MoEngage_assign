const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  dob: Date,
  verified: Boolean
});

const User = mongoose.models.Users || mongoose.model("Users", UserSchema);

module.exports = User;

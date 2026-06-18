const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// 👇 IMPORTANT FIX
module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);
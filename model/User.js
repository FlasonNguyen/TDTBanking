//create User model in mongoose
const mongoose = require("mongoose");
const User = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  balance: { type: Number, required: true },
});

module.exports = mongoose.model("User", User);

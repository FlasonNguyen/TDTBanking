const express = require("express");
const mongoose = require("mongoose");
const Transaction = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentId: { type: String, required: true },
  studentName: { type: String },
  amount: { type: Number },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Transaction", Transaction);

const express = require("express");
const router = express.Router();
const sendMail = require("../utils/mailer");
const Transaction = require("../model/Transaction");
const User = require("../model/User");
const StudentDept = require("../model/StudentDept");
const { route } = require("./login");
const req = require("express/lib/request");

function refreshOtp() {
  const otp = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  return parseInt(otp);
}
function moneyFormatted(money) {
  const formatter = Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(money);
}
let otp = refreshOtp();
//run a function every 5 minutes
setInterval(() => {
  otp = refreshOtp();
}, 300000);

router.post("/send-otp", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  sendMail(
    req.session.user.email,
    "OTP",
    `<h1>OTP</h1>
    <p>${otp}</p>`
  );
});
router.post("/searchStudent", async (req, res) => {
  const { studentId } = req.body;
  const student = await StudentDept.findOne({ studentId });
  if (!student) {
    return res.send(null);
  } else {
    return res.send(student);
  }
});
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const ObjectId = require("mongoose").Types.ObjectId;
  const history = await Transaction.find({
    user: ObjectId(req.session.user._id),
  });
  const user = await User.findById(req.session.user._id);
  return res.render("index", {
    fullname: user.fullname,
    phone: user.phone,
    email: user.email,
    balance: moneyFormatted(user.balance),
    history: history,
  });
});
router.get("/studentDept", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const studentDept = await StudentDept.find();
  return res.send(studentDept);
});

router.post("/tuition", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  let inputOtp = req.body.otp;
  if (inputOtp == otp) {
    const { studentid, studentName, amount } = req.body;
    if (amount > req.session.user.balance) {
      return res.send("Insufficient Balance");
    }
    const user = await User.findById(req.session.user._id);
    const student = await StudentDept.findOne({ studentId: studentid });
    console.log(student);
    if (!student) {
      return res.send("Student not found");
    }
    if (amount > student.dept) {
      amount = student.dept;
    }
    const transaction = new Transaction({
      user: user._id,
      studentId: student.studentId,
      studentName,
      amount,
      date: new Date(),
    });
    user.balance -= amount;
    student.dept -= amount;
    await user.save();
    await transaction.save();
    await student.save();
    sendMail(
      user.email,
      "Transaction",
      `<h1>Transaction Success</h1><h2>Amount: ${amount}</h2><h2>Description: ${studentName}</h2>`
    );
    return res.redirect("/index");
  } else {
    return res.send("Wrong OTP");
  }
});

module.exports = router;

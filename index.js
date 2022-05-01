const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "flason",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/login", require("./routes/login"));
app.use('/index', require("./routes/transaction"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected");
    app.listen(process.env.PORT, () => {
      console.log("Server started");
    });
  })
  .catch((err) => console.log(err));

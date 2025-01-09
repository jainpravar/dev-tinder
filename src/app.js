const express = require("express");

const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("database connected successfully!!");
    app.listen("7777", () => {
      console.log("code is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Error in connecting database!!");
  });

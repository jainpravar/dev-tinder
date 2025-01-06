const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const User = require("./models/User");
const { userAuth } = require("./middlewares/auth");
const app = express();
app.use(express.json());
app.use(cookieParser());

// get user from database
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(404).send("ERROR: " + error.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).send("user not found!!");
    }
    const isUserValid = await user.validatePassword(password);
    if (isUserValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });
      res.status(200).send("logged in successfull!!");
    } else {
      res.status(404).send("incorrect credentials !!");
    }
  } catch (error) {
    console.log(error);
  }
});
app.post("/signup", async (req, res) => {
  try {
    const userData = req.body;
    const { password } = userData;
    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log(encryptedPassword);
    const newUser = new User({ ...userData, password: encryptedPassword });
    await newUser.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

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

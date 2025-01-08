const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { validateSignupData } = require("../utils/validator");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const userData = req.body;
    validateSignupData(userData)
      const { password } = userData;
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ ...userData, password: encryptedPassword });
      await newUser.save();
      res.send("user added successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isUserValid = await user.validatePassword(password);
    if (isUserValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });
      res.status(200).send("logged in successfull!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR" + error);
  }
});

authRouter.get("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("logged out successfully.");
});

module.exports = authRouter;

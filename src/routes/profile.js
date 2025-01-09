const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validator");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(404).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const editProfileData = req.body;
    if (!validateProfileEditData(editProfileData)) {
      throw new Error("Invalid Edit request");
    }
    const loggedInUser = req.user;
    Object.keys(editProfileData).forEach(
      (key) => (loggedInUser[key] = editProfileData[key])
    );
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile is updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(404).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    const isUserValid = await user.validatePassword(oldPassword);
    if (!isUserValid) {
      throw new Error("Invalid old password");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("please enter strong password");
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { _id: user._id },
      { password: encryptedPassword }
    );
    res.send("password updated successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;

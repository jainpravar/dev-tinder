const User = require("../models/User");
const JWT = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if(!token){
        throw new Error("Invalid token");
    }
    const decodedMessage = await JWT.verify(token, "DEV@Tinder$123");
    const user = await User.findById(decodedMessage._id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message)
  }
};

module.exports = { userAuth };

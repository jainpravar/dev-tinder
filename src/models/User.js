const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const userSchema = Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Password is not strong" + value);
        }
      }
    },
    skills: {
      type: [String],
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a user type.`,
      },
    },
    photoUrl: {
      type: String,
      validate(value){
        if(!validator.isURL(value)){
            throw new Error("invalid url" + value);  
        }
      },
      default:"https://geographyandyou.com/images/user-profile.png"
    },
    about:{
        type: String,
        default: "This is defult about of the user."
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = JWT.sign({ _id: user._id }, "DEV@Tinder$123", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isUserValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isUserValid;
}
module.exports = mongoose.model("User", userSchema);

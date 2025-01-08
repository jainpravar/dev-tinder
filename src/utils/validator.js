const validator = require("validator");

const validateSignupData = (signupData) => {
  const { email, password, firstName, lastName } = signupData;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password.");
  }
};

const validateProfileEditData = (profileData) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "gender",
    "about",
    "photoUrl",
    "skills",
    "age",
  ];
  const isAllowed = Object.keys(profileData).every((key) => allowedFields.includes(key));
  return isAllowed;
};
module.exports = {
  validateSignupData,
  validateProfileEditData
};

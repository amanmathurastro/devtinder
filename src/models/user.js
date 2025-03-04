const mongoose = require("mongoose");
const { Schema } = mongoose;

/*
 * * First create schema and inside that use camelCasing (good Practice).
 */

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
});

//* Model Name should be Capitalized

const User = mongoose.model("User", userSchema);

module.exports = User;

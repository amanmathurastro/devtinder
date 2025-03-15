const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

/*
 * * First create schema and inside that use camelCasing (good Practice).
 */

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

//* Model Name should be Capitalized

const User = mongoose.model("User", userSchema);

module.exports = User;

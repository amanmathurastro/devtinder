const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json()); //* Converts the req body into js object  from json
app.use(cookieParser()); //* parse thr cookies

//* get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("no user found with email");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Error fetching the user");
  }
});

//* Get all user

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).send("Error fetching the user");
  }
});

//* Delete user by id

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    // const res = await User.findByIdAndDelete({ _id: userId }); //* has same output
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting  the user", error);
  }
});
//* update user by id

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    // const res = await User.findByIdAndDelete({ _id: userId }); //* has same output
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error updating the user", error);
  }
});

//* Sign up user api
app.post("/signup", async (req, res) => {
  try {
    //validate the req body
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.status(200).send("User created Successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    }
    const token = await jwt.sign({ _id: user._id }, "SECRET@AKM");
    res.cookie("token", token);
    res.status(200).send("Login Successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;

    const decoded = jwt.verify(token, "SECRET@AKM");
    console.log(decoded);
    const user = await User.findById(decoded._id);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error);
  }
});
/*
 * * Connect to database 1st and then your your server should listening
 */
connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(3000, () => {
      console.log("Server is successfully on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting Database.....", err);
  });

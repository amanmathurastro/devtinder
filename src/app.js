const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json()); //* Converts the req body into js object  from json

//* get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  console.log("useremail", userEmail);
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
    const user = await User.findByIdAndUpdate(userId, data);
    console.log(user);
    // const res = await User.findByIdAndDelete({ _id: userId }); //* has same output
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error updating the user", error);
  }
});

//* Sign up user api
app.post("/signup", async (req, res) => {
  const user = new User(req?.body);
  try {
    await user.save();
    res.send("User created Successfully");
  } catch (err) {
    res.status(400).send("Error Saving user");
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

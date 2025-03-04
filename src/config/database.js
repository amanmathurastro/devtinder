const mongoose = require("mongoose");

const connectDB = async () => {
  return await mongoose.connect(
    "mongodb+srv://amanmathurastro:WEZV5QokuVW49O22@node.xbf8j.mongodb.net/devTinder"
  );
};

module.exports = {
  connectDB,
};

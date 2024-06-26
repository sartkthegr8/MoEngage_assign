require('dotenv').config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Database Connection Successfull !!");
  })
  .catch((err) => {
    console.log("Connection Failed !!", err);
  });

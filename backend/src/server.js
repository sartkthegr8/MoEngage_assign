// Require necessary modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Require route handlers
const UserRouter = require("./api/Users"); // Example user routes
const ReviewRouter = require("./api/reviews"); // Review routes

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Body parser middleware

// Connect to MongoDB (assuming your database connection setup is in ./config/database.js)
require("./config/database");

// Routes
app.use("/user", UserRouter); // Example user routes
app.use("/api/reviews", ReviewRouter); // Review routes

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

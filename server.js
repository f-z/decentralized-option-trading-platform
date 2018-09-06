/* ===================
   Importing Node modules
=================== */
const env = require("./env");
const express = require("express"); // Fast, unopinionated, minimalist web framework for node
const app = express(); // Initiate Express application
const router = express.Router(); // Creating a new router object
const mongoose = require("mongoose"); // Node tool for MongoDB
mongoose.Promise = global.Promise;
const config = require("./config/database"); // Mongoose Ccnfig
const path = require("path"); // NodeJS package for file paths
const authentication = require("./routes/authentication")(router); // Importing authentication routes
const bodyParser = require("body-parser"); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require("cors"); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const port = process.env.PORT || 8080; // Allows Azure to set port

// Database connection
mongoose.connect(config.uri,
  err => {
    // Checking if database was able to connect
    if (err) {
      console.log("Could NOT connect to database: ", err); // Return error message
    } else {
      console.log("Connected to " + config.db); // Return success message
    }
  }
);

// Middleware
app.use(cors({
  origin: "http://localhost:4200"
})); // Allows cross origin in development only
app.use(bodyParser.urlencoded({
  extended: false
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + "/public")); // Provide static directory for frontend
app.use("/authentication", authentication); // Use Authentication routes in application

// Connecting server to Angular index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/src/index.html"));
});

// Start server: listening on port 8080
app.listen(port, () => {
  console.log(
    "Listening on port " + port + " in " + process.env.NODE_ENV + " mode"
  );
});
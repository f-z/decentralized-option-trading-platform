const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  config = require("./config/DB");

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(
  () => {
    console.log("Database connection established");
  },
  err => {
    console.log("Error connecting to database: " + err);
  }
);

const userRoutes = require("./routes/user.route");

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 4000;

app.use("/users", userRoutes);

const server = app.listen(port, function() {
  console.log("Listening on port: " + port);
});

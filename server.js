let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");
let axios = require("axios");
let cheerio = require("cheerio");

// Require all models
let db = require("./models");

let PORT = process.env.PORT || 3000;

// Initialize Express
let app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Set Handlebars
let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://user1:password1@ds039185.mlab.com:39185/heroku_g0n5zgqc";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
let syncOptions = {
  force: false
};

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
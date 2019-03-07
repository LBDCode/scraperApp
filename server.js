var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
// var cheerio = require("cheerio");
var db = require("./models");
// var ObjectID = require('mongoose').Types.ObjectId;


var PORT = process.env.PORT || 3000;
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

//hbars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//routes
require("./routes/apiroutes")(app);
require("./routes/htmlroutes")(app);


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
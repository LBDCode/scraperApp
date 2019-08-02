var db = require("../models");


module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Article.find({})
    .populate("note")
    .then(function(dbArticles) {
      res.render("index", 
      {articles: dbArticles});
    })
    .catch(function(err) {
      res.json(err);
    })
  });

  app.get("/saved", function(req, res) {
    db.Article.find({ "saved": true })
    .populate("note")
    .then(function(dbSaved) {
      res.render("index", 
      {articles: dbSaved});
    })
    .catch(function(err) {
      res.json(err);
    })
  });

};
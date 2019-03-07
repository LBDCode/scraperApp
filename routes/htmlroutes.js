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

};
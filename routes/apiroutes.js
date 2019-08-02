var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

var ObjectID = require('mongoose').Types.ObjectId;


module.exports = function(app) {
 // Route for getting all posts
  app.get("/api/articles", function(req, res) {
    db.Article.find({})
    .populate("note")
    .then(function(dbArticles) {
      res.json(dbArticles);
    })
    .catch(function(err) {
      res.json(err);
    })
  });

  //scrape route
  app.get("/api/scrape", function(req, res) {
    //clear old, unsaved articles
    db.Article.deleteMany({ "saved": false }).exec();
    //get array of saved posts
    var titles = [];
    db.Article.find({ "saved": true }).select("title").then(function(dbArts) {
      dbArts.forEach(function (post, index) {
        titles.push(post.title);
      })

    }).then(function() {
      //scrape r/compsci
      axios.get("https://old.reddit.com/r/compsci/").then(function(response) {
        var $ = cheerio.load(response.data);
    
        $("p.title").each(function(i, element) {
          var result = {};
          var pTitle = $(this)
          .children("a")
          .text();

          //check if post already saved.  If not...
          if(!titles.includes(pTitle)) {
            //parse info from cheerio and populate result obj
            result.title = pTitle;
    
            result.origin = $(this)
              .children("span")
              .children("a")
              .text();  
      
            let link = $(this)
              .children("a")
              .attr("href");
              
            if (link.slice(0,3) === "/r/"){
              link = "https://old.reddit.com" + link;
            }
      
            let tag = $(this)
              .siblings(".tagline");
            let date= $(tag)
              .children("time") 
              .text();
            let submitter = $(tag)
              .children("a") 
              .text();
                 
            let tagline = "submitted " + date + " by " + submitter;  
    
            result.link =  link;
            result.tagline = tagline;
            //create post in mongo
            db.Article.create(result)
              .then(function(dbArticle) {
              })
              .catch(function(err) {
                console.log(err);
            });
          } 
        });
    
        res.send("Scrape Complete");
      });
    });


  });
  
  
  //Route to save a post
  app.put("/api/articles/:id", function(req, res) {
    update = req.body;
    var id = new ObjectID(req.params.id)
  
    db.Article.findOneAndUpdate({ _id: id},
      {$set: update
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  
  });

  
  // Route for specific post
  app.get("/api/articles/:id", function(req, res) {
    var id = new ObjectID(req.params.id)

    db.Article.findOne({
      _id: id
    }).populate("note")
    .then(function(dbArt) {
      res.json(dbArt);
    })
    .catch(function(err) {
      res.json(err);
    })
  });


  // save notes
  app.post("/api/articles/:id", function(req, res) {

    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  

};
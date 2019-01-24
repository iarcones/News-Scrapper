var cheerio = require("cheerio");
var request = require("request")


// Require all models
var db = require("../models");

module.exports = function (app) {

  // app.get("/", function (req, res) {
  //   res.render("index");
  // });

  // A GET route for scraping the echoJS website
  app.get("/", function (req, res) {

    request.get("https://www.nytimes.com/trending", function (error, response, body) {

      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if 

      var $ = cheerio.load(body);
      var hbsObject = { "articles": [] };
      var counter = 0

      $(".css-1iski2w")
        .each(function (i, element) {

          // Save an empty result object
          console.log("counter: ", counter++)
          var result = {};

          result.title = $(this).find("h1").text()
          result.link = $(this).find("a").attr("href")
          result.image = $(this).find("img").attr("src")

          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function (dbArticle) {

              // console.log("dbArticle........")
              // console.log(dbArticle);

            })
            .catch(function (err) {
              // If an error occurred, log it
              console.log("err........")
              console.log(err);
              console.log("code...................: ", err.name)
              console.log("code...................: ", err.code)

            });
        });
      res.redirect("/articles")
    });

  })

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    console.log("/articles")
    // Grab every document in the Articles collection
    db.Article.find({ saved: "false" })
      .then(function (dbArticle) {
        var hbsObject = {
          articles: dbArticle
        }
        console.log("............................hbsObject")
        console.log(hbsObject)
        res.render("index", hbsObject);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for getting all Articles  Saved from the db
  app.get("/mynews", function (req, res) {
    console.log("/mynews")

    // Grab every ARTICLE SAVED
    db.Article.find({ saved: "true" })
      .populate("notes")
      .then(function (dbArticle) {
        var hbsObject = {
          articles: dbArticle
        }
        console.log("............................hbsObject")
        console.log(hbsObject)
        res.render("index-mynews", hbsObject);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // GET One Articles from the db
  app.get("/articlenote/:id", function (req, res) {
    console.log("/articlenote")
    // Grab every document in the Articles collection
    db.Article.findOne({ _id: req.params.id})
    .populate("notes")
      .then(function (dbArticle) {
        console.log("............................dbArticle")
        console.log(dbArticle)
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // SAVE ARTICLE
  app.put('/articles/save/:id', function (req, res) {

    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
      .then(function (dbArticle) {
     
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // DELETE ARTICLE
  app.put('/articles/delete/:id', function (req, res) {

    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: false } })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // SAVE NOTE
  app.post("/articlenote/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    console.log(req.body)
    let counternotes = 0
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // DELETE NOTE
  app.delete("/notes/delete/:id", function (req, res) {
    db.Note.findOneAndDelete({ _id: req.params.id })
      .then(function (dbNote) {
        res.json(dbNote)
      })
      .catch(function (err) {
        res.json(err);
      });;
  });


}



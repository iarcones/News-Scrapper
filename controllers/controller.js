var cheerio = require("cheerio");
var request = require("request")
var Pro = require("bluebird");

// Require all models
var db = require("../models");

module.exports = function (app) {

    // app.get("/", function (req, res) {
    //     //   res.render("index");
    //     res.redirect("/articles")
    // });

  
    app.get("/", function (req, res) {

        request.get("https://abcnews.go.com/Politics", function (error, response, body) {

            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the 

            var $ = cheerio.load(body);

            var totArticles = { "articles": [] };
            

            Pro.each($(".tag-block").get(), function (newArticles) {

                console.log(newArticles)
                var result = {};
                result.title = $(newArticles).find(".black-ln").text().trim()
                result.summary = $(newArticles).find(".desc").text().trim()
                result.link = $(newArticles).find("a").attr("href")
                result.image = $(newArticles).find("img").attr("data-src")

                totArticles.articles.push(result);

            })
                .then(function () {

                    updateDB(totArticles)

                }).then(function () {
                    res.redirect("/articles")
                })
        });

    })

    function updateDB(result) {

        /// update the DB in desc order to keep the last news created in the last order, in this way when we call the db.Article.find() we sort in desc order to keep always the latest news the first to see in screen (the html for scraping is getting the info top to down)

        for (var i = result.articles.length - 1; i >= 0; i--) {
            db.Article.create(result.articles[i])
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
        }
    }

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        console.log("/articles")
        // Grab every document in the Articles collection
        db.Article.find({ saved: "false" }).sort([['date', -1]])
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
        db.Article.find({ saved: "true" }).sort([['date', -1]])
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
        db.Article.findOne({ _id: req.params.id })
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

    // UNSAVE ARTICLE
    app.put('/articles/unsave/:id', function (req, res) {

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



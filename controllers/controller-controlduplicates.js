var cheerio = require("cheerio");
var request = require("request")
// var Pro = require("bluebird");


// Require all models
var db = require("../models");

module.exports = function (app) {

    var hbsObject = { "articles": [] };

    var counter1 = 0
    var counter2 = 0
    var counter3 = 0
    // A GET route for scraping the echoJS website
    app.get("/scrape", function (req, res) {


        request('https://www.nytimes.com/trending/', function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.

            var $ = cheerio.load(body);

            Pro.each($(".css-1iski2w").get(), function (el) {
                console.log("........................element")
                // console.log(el)
                console.log("counter1: ", counter1++)
                var result = {};

                result.title = $(el).find("h1").text()
                result.link = $(el).find("a").attr("href")
                result.image = $(el).find("img").attr("src")

                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        // console.log("dbArticle........")
                        // console.log(dbArticle);
                        console.log("counter3: ", counter3++)
                        hbsObject.articles.push(dbArticle);
                        // console.log("dbArticle")
                        // console.log(dbArticle)
                        // res.json(dbArticle)
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log("err........")
                        console.log(err);
                        console.log("code...................: ", err.name)
                        console.log("code...................: ", err.code)

                    });

            })
                .then(function () {

                    console.log("....................hbsObject.................")
                    console.log(hbsObject)
                });
        })


    })

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


// var Promises = require('bluebird');

// request('http://myurl', function (req, res, data) {
//     var $ = cheerio.load(data);
//     var List = [];

//     Promises
//         // Use this to iterate serially
//         .each($('.myItems').get(), function (el) {
//             console.log(typeof $(el).text())
//             List.push($(el).text());
//         })
//         // Use this if order of items is not important
//         .map($('.myItems').get(), function (el) {
//             console.log(typeof $(el).text())
//             List.push($(el).text());
//         }, { concurrency: 1 }) // Control how many items are processed at a time
//         // When all of the above are done, following code will be executed
//         .then(function () {
//             for (var i = 0; i < List.length; i++) {
//                 // make an asynchronous call to a API
//             }
//         });
// });

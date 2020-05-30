var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");


module.exports = function (app) {

    // A GET route for scraping the NPR website
    app.get("/api/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.npr.org/sections/news").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every div with a class of "story-text", and do the following:
            $(".item-info").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Get the title, summary text, and href link of each article, and save them as properties of the result object
                result.title = $(this).find(".title").text();
                result.summary = $(this).find(".teaser").children("a").text();
                result.link = $(this).children().children("a").attr("href");

                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function () {
                        // View the added result in the console
                        // console.log(dbArticle);
                        res.end();
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
        });
    });

    // Route for saving an article (setting saved property to true)
    app.post("/api/save-article/:id", function (req, res) {
        db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            saved: true
        }).then(function () {
            res.end();
        }).catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
    });


    // Route for 'deleting' all saved articles (updating all the saved properties to false)
    app.post("/api/delete-all-saved", function (req, res) {
        db.Article.updateMany({}, {
            $set: {
                saved: "false"
            }
        }).then(function () {
            res.end();
        }).catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
    });

    // Route for 'deleting' a single saved article from saved articles (updating the saved property to false)
    app.post("/api/delete-saved/:id", function (req, res) {
        db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            saved: false
        }).then(function () {
            res.end();
        }).catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
    });

    // Route for deleting all articles, that aren't saved, from the main page
    app.post("/api/delete-all-unsaved", function (req, res) {
        db.Article.deleteMany({
            saved: false
        }).then(function () {
            res.end();
        }).catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
    });

    // Route for saving a note for an article.
    app.post("/api/save-article-note/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        var articleId = req.params.id;
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id
                }, {
                    new: true
                });
            })
            .then(function () {
                // Update the notes displayed in the modal
                // db.Note.find({
                //     articleId: articleId
                // }).then(function (notesArr) {
                //     // console.log(notesArr);
                //     // for loop over all the notes with this article id to display them.
                //     var i;
                //     for (i = 0; i < notesArr.length; i++) {
                //         console.log("note number " + i + ": " + notesArr[i])
                //     }

                // });
                res.end();

            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });



    app.get("/api/article-notes/:id", function (req, res) {
        var articleId = req.params.id;
        db.Note.find({
            articleId: articleId
        }).then(function (notesArr) {
            // for loop over all the notes with this article id to display them.
            // var i;
            // for (i = 0; i < notesArr.length; i++) {
            //     console.log("note number " + i + ": " + notesArr[i])
            // }
            res.json(notesArr);
        }).catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

    });
};
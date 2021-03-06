let db = require("../models");
let axios = require("axios");
let cheerio = require("cheerio");


module.exports = function (app) {

    // A GET route for scraping the NPR website
    app.get("/api/scrape", function (req, res) {
        // Grab the body of the html with axios
        axios.get("https://www.npr.org/sections/news").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            let $ = cheerio.load(response.data);

            // Grab every div with a class of ".item-info", and do the following:
            $(".item-info").each(function (i, element) {
                // Save an empty result object
                let result = {};

                // Get the title, summary text, and href link of each article, and save them as properties of the result object
                result.title = $(this).find(".title").text();
                result.summary = $(this).find(".teaser").children("a").text();
                result.link = $(this).children().children("a").attr("href");

                // Create a new Article using the `result` object above
                db.Article.create(result)
                    .then(function () {
                        res.end();
                    })
                    .catch(function (err) {
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
            console.log(err);
        });
    });


    // Route for saving a note for an article.
    app.post("/api/save-article-note/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        let articleId = req.params.id;
        db.Note.create(req.body)
            .then(function (dbNote) {
                // After vreating the note, find that article and add the note id to the note ref in the Article model
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id
                }, {
                    new: true
                });
            })
            .then(function () {
                res.end();
            })
            .catch(function (err) {
                res.json(err);
            });
    });


    // Route for getting all notes by article id.
    app.get("/api/article-notes/:id", function (req, res) {
        let articleId = req.params.id;
        db.Note.find({
            articleId: articleId
        }).then(function (notesArr) {
            res.json(notesArr);
        }).catch(function (err) {
            res.json(err);
        });

    });


    // Route for deleting a single note by that note's id.
    app.post("/api/delete-article-note/:id", function (req, res) {
        let noteId = req.params.id;
        db.Note.deleteOne({
            _id: noteId
        }).then(function () {
            res.end();
        }).catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        })
    });
};
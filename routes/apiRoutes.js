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



};
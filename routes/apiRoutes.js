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
                    .then(function (dbArticle) {
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



};
let db = require("../models");

module.exports = function (app) {

    // Route to desplay the 'home page'
    app.get("/", function (req, res) {
        db.Article.find({
                saved: "false"
            }).sort({
                'summary': -1
            })
            .then(function (dbArticles) {
                let a = dbArticles.map(function (article) {
                    return {
                        id: article._id,
                        title: article.title,
                        summary: article.summary,
                        link: article.link
                    };
                });

                let hbsObject = {
                    articles: a
                };
                res.render("index", hbsObject);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });

    // Route to desplay the 'saved articles page'
    app.get("/saved-articles", function (req, res) {
        db.Article.find({
                saved: "true"
            }).sort({
                'summary': -1
            })
            .then(function (dbArticles) {
                let a = dbArticles.map(function (article) {
                    return {
                        id: article._id,
                        title: article.title,
                        summary: article.summary,
                        link: article.link
                    };
                });

                let hbsObject = {
                    articles: a
                };
                res.render("saved-articles", hbsObject);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });








    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};
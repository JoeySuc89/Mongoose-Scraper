var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var axios = require('axios');
var cheerio = require('cheerio');

var db = require('./models');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

mongoose.connect(MONGODB_URI);

//localhost:3000/

app.get("/scrape", function (req, res) {
  axios.get("https://www.burlingtoncountytimes.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    $("article").each(function (i, element) {
      var result = {};
      if($(this).hasClass('summary')){
        result.title = $(this)
        .find("h3")
        .text().replace(/[\t\n]+/g,'');

        result.link = $(this)
        .find("h3")
        .children("a")
        .attr("href");
      }

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    // res.render("index");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      // console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("comment")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  console.log(req.body);
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function (dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log('App now listening at localhost:' + PORT)
});

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

// When Scrape New Articles button is clicked, scrape news and update the DB.
$(document).on("click", ".scrape", function () {
  event.preventDefault();
  $.ajax({
    method: "GET",
    url: "/api/scrape"
  }).then(function () {
    // Refresh the page with the scraped articles.
    location.reload();
  });
});

// When Save Article button is clicked, update the saved property to true.
$(document).on("click", ".save-article", function () {
  event.preventDefault();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/api/save-article/" + thisId
  }).then(function () {
    // Refresh the page (to get only unsaved articles on the page)
    location.reload();
  });
});

// When Saved Articles button is clicked, change URL to /saved-articles to hit that route in html routes.
$(document).on("click", ".saved-articles", function () {
  event.preventDefault();
  window.location.assign("/saved-articles");
});

// When delete all saved articles button is clicked, hit api route to update all article 'saved' properties to false and reload the page.
$(document).on("click", ".delete-all-saved", function () {
  event.preventDefault();
  $.ajax({
    method: "POST",
    url: "/api/delete-all-saved"
  }).then(function () {
    location.reload();
  });
});

// When an individual article's Delete From Saved button is clicked, hit api route to update that article's saved property to false and reload the page.
$(document).on("click", ".delete-saved", function () {
  event.preventDefault();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/api/delete-saved/" + thisId
  }).then(function () {
    location.reload();
  });
});

// When the Clear These Articles button is clicked, hit the API route to clear all unsaved articles.
$(document).on("click", ".clear-articles", function () {
  event.preventDefault();
  $.ajax({
    method: "POST",
    url: "/api/delete-all-unsaved"
  }).then(function () {
    location.reload();
  });
});

// When the Return to Home Page button is clicked, re-direct to the home page.
$(document).on("click", ".home", function () {
  event.preventDefault();
  window.location.assign("/");
});


// When Article Notes button is clicked, pop modal and populate with any notes for that article.
$(document).on("click", ".article-notes", function (event) {
  event.preventDefault();
  var thisId = $(this).attr("data-id");
  $(".save-note").removeData("article-id");
  $(".save-note").data("article-id", thisId);
  // console.log($(".save-note").data("article-id"))

});



// When Save Note button is clicked, hit api route to save the note.
$(document).on("click", ".save-note", function (event) {
  event.preventDefault();
  var thisId = $(this).data("article-id");
  console.log(thisId);



});




// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });

});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
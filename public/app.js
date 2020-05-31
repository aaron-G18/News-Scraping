// When Scrape New Articles button is clicked, scrape news and update the DB.
$(document).on("click", ".scrape", function (event) {
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
$(document).on("click", ".save-article", function (event) {
  event.preventDefault();
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/api/save-article/" + thisId
  }).then(function () {
    // Refresh the page (to get only unsaved articles on the page)
    location.reload();
  });
});


// When Saved Articles button is clicked, change URL to /saved-articles to hit that route in html routes.
$(document).on("click", ".saved-articles", function (event) {
  event.preventDefault();
  window.location.assign("/saved-articles");
});


// When delete all saved articles button is clicked, hit api route to update all article 'saved' properties to false and reload the page.
$(document).on("click", ".delete-all-saved", function (event) {
  event.preventDefault();
  $.ajax({
    method: "POST",
    url: "/api/delete-all-saved"
  }).then(function () {
    location.reload();
  });
});


// When an individual article's Delete From Saved button is clicked, hit api route to update that article's saved property to false and reload the page.
$(document).on("click", ".delete-saved", function (event) {
  event.preventDefault();
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/api/delete-saved/" + thisId
  }).then(function () {
    location.reload();
  });
});


// When the Clear These Articles button is clicked, hit the API route to clear all unsaved articles.
$(document).on("click", ".clear-articles", function (event) {
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
  let thisId = $(this).attr("data-id");
  let thisTitle = $(this).attr("data-title");
  // Save the article id as data on the save note button.
  $(".save-note").removeData("article-id");
  $(".save-note").data("article-id", thisId);
  $(".article-title").text(thisTitle);
  $.ajax({
    method: "GET",
    url: "/api/article-notes/" + thisId
  }).then(function (notesArr) {
    // for loop over all the notes with this article id to display them.
    console.log("Article Notes button notesArr: ", notesArr);
    $("#notes").empty();
    let i;
    for (i = 0; i < notesArr.length; i++) {
      // console.log("note number " + i + ": " + notesArr[i])
      $("#notes").append("<li>" + notesArr[i].body + "<button class='delete-note' data-noteid='" + notesArr[i]._id + "' data-articleid='" + thisId + "'>X</button></li>")
    }
  });
});


// When Save Note button is clicked, hit api route to save the note.
$(document).on("click", ".save-note", function (event) {
  event.preventDefault();
  let thisId = $(this).data("article-id");
  let noteText = $("#note-body").val().trim();
  console.log("Save Note button note text: ", noteText);
  $.ajax({
    method: "POST",
    url: "/api/save-article-note/" + thisId,
    data: {
      body: noteText,
      articleId: thisId
    }
  }).then(function (data) {
    $.ajax({
      method: "GET",
      url: "/api/article-notes/" + thisId
    }).then(function (notesArr) {
      // for loop over all the notes with this article id to display them.
      $("#notes").empty();
      let i;
      for (i = 0; i < notesArr.length; i++) {
        $("#notes").append("<li>" + notesArr[i].body + "<button class='delete-note' data-noteid='" + notesArr[i]._id + "' data-articleid='" + thisId + "'>X</button></li>")
      };
      $("#note-body").val("");
    });
  });
});


// When the "X" next to a note is clicked to delete that note, hit the api route to delete that note and then update the modal
$(document).on("click", ".delete-note", function (event) {
  event.preventDefault();
  let thisNoteId = $(this).data("noteid");
  let thisId = $(this).data("articleid");
  $.ajax({
    method: "POST",
    url: "/api/delete-article-note/" + thisNoteId
  }).then(function (data) {
    $.ajax({
      method: "GET",
      url: "/api/article-notes/" + thisId
    }).then(function (notesArr) {
      // for loop over all the notes with this article id to display them.
      $("#notes").empty();
      let i;
      for (i = 0; i < notesArr.length; i++) {
        $("#notes").append("<li>" + notesArr[i].body + "<button class='delete-note' data-noteid='" + notesArr[i]._id + "' data-articleid='" + thisId + "'>X</button></li>")
      };
      $("#note-body").val("");
    });
  });
});
// Grabbing the Articles as JSON

$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    $(#articles).append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + "</p>");
  }
});

$(document).on("click", "p", function() {
  $("#comments").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    methos: "GET",
    url: "/articles/" + thisId
  })
   .then(function(data) {
     console.log(data);

     $("#comments").append("<h3>" + data.title + "</h3>");
     $("#comments").append("<input id= 'titleinput' name='title' >");
     $("#comments").append("<textarea id='bodyinout' name='body'></textarea>");
     $("#comments").append("<button data-id='" + data.id + "' id='savecomment'>Save Comment</button>");

     if (data.comment) {
      $("#titleinput").val(data.comment.title);
      $("#bodyinput").val(data.comment.body);
     }
   });
});

$(document).on("click", "#savenote", function() {

var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#comments").empty();
    });
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

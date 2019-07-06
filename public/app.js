$(document).ready(function() {
  $("#scrapebtn").on("click", function(){
    $.get("/scrape", function(data){
      console.log(data);
      $("#articles").html(JSON.stringify(data));
      window.location.reload();
    });
  });
  // Grabbing the Articles as JSON
  console.log("app.js");
  $.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
      // data[i].link
      // $("#articles").append("<p data-id='" + data[i]._id + "'><a href='" + data[i].link + "' target='_blank' >" + data[i].title + "</a> <br />" + "</p>");
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "</p>");
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
     $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

     if (data.comment) {
      $("#comment_scr .c_ul").append('<li> ' + data.comment.title + '<br>' + data.comment.body + '</li>');
     }
   });
});

$(document).on("click", "#savecomment", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinout").val()
    }
  })
  .then(function(data) {
      console.log(data);
      $("#comments").empty();
    });
    $("#titleinput").val("");
    $("#bodyinout").val("");
});

})

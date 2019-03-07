$(".scrape").on("click", scrapeArticles);

$("#save-comment-text").on("click", function(event) {
  event.preventDefault();
  saveComment($(this));
});

$("#delete-comment-text").on("click", function(event) {
  event.preventDefault();
  deleteComment($(this));
});

$(document).on("click", ".save", function(event) {
  event.preventDefault();
  savePost($(this).data("id"), $(this).attr("data-save"));
});

$(document).on("click", ".comment", function(event) {
  event.preventDefault();
  commentPost($(this));
});


function scrapeArticles() {
    $.get("/api/scrape").then(function(data) {
        location.reload(true);
    });
};


function savePost(id, state) {

  $.ajax({
    url: 'api/articles/' + id,
    type: 'PUT',
    data: {"saved": state},
    success: function(data) {
      location.reload(true);
    }
  });

};

function commentPost(elem) {
  var postID = elem.data("id");
  var postTitle = elem.attr("data-title");
  $("#comment-title").text("Add comment: " + postTitle);
  $("#save-comment-text").data("id", postID);
  $("#delete-comment-text").data("id", postID);
}

function saveComment(elem) {
  var postID = elem.data("id");
  var text = $("#commentText").val().trim();
  var note = {
    post: postID,
    body: text
  };

  $.ajax({
    url: 'api/articles/' + postID,
    type: 'POST',
    data: note,
    success: function(data) {
      $("#commentText").val("");
    }
  });
  savePost(postID, true);
  location.reload(true);

}


function deleteComment(elem) {
  var postID = elem.data("id");
  var text = "";
  var note = {
    post: postID,
    body: text
  };

  $.ajax({
    url: 'api/articles/' + postID,
    type: 'POST',
    data: note,
    success: function(data) {
      $("#commentText").val("");
    }
  });
  location.reload(true);
}


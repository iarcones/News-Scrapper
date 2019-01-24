// // Grab the articles as a json
// $.getJSON("/articles", function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the apropos information on the page
//       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
//   });

$(document).on("click", "#mynews", function () {
  console.log("onclick mynews");
  window.location.href = "/mynews"
})
$(document).on("click", "#scrape", function () {
  console.log("onclick scrape");
  window.location.href = "/scrape"
})
$(document).on("click", "#home", function () {
  console.log("onclick home");
  window.location.href = "/"
})

// When you click the SAVE ARTICLE button
$(document).on("click", ".savearticle", function () {
  // Grab the id associated with the article from the submit button
  console.log("click on save")
  var id = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/articles/save/" + id,
  })
    // With that done
    .then(function (data) {
      location.reload();
      console.log(data);
      // Empty the notes section
    });
});

$(document).on("click", ".deletearticle", function () {
  // Grab the id associated with the article from the submit button
  console.log("click on save")
  var id = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/articles/delete/" + id,
  })
    // With that done
    .then(function (data) {
      // Log the response
      location.reload();
      // Empty the notes section
    });
});



// 1. click listener on "add note"
// 2. ajax call to our server for note
// 3. in promise, populate modal (treat )
// 4. show the modal ($("#myModal").show())

$(document).on("click", "#viewnotes", function () {
  console.log(".......viewnotes")
  var id = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articlenote/" + id,
  })
    .then(function (data) {
      console.log(data);
      $("#modalnote").find("#thenotes").empty();

      console.log(data.notes)
      for (let i = 0; i < data.notes.length; i++) {
        let title = data.notes[i].title
        let comment = data.notes[i].comment
        console.log(title, comment)
        let temp = (`<p>Title: ${title} Comment: ${comment}`)
        console.log(temp)

        $("#modalnote").find("#thenotes").append(temp);
      }

      let temp = (`<button class="btn-sm btn-success" id="savenote" data-toggle="modal" data-target="#modalnote" data-id="${id}">Add to Saved!</button>`)

      console.log("temp: ", temp)

      $("#modalnote").find("#buttonsaved").empty();
      $("#modalnote").find("#buttonsaved").append(temp);

      $("#modalnote").modal("show")

    });
})


$(document).on("click", "#savenote", function () {
  console.log(".......savenote")
  // Grab the id associated with the article from the submit button
  var id = $(this).attr("data-id");
  var title = $("#notetitle").val().trim();
  var comment = $("#notebody").val().trim();

  if (!title) {
    console.log("title empty")
  }
  else {
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articlenote/" + id,
      data: {
        // Value taken from note textarea
        title: title,
        comment: comment
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#notetitle").val("");
    $("#notebody").val("");
  }
});





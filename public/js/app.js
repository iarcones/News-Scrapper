
$(document).on("click", "#mynews", function () {
  console.log("onclick mynews");
  window.location.href = "/mynews"
})
$(document).on("click", "#scrape", function () {
  console.log("onclick scrape");
  window.location.href = "/"
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

  console.log("click on save")
  var id = $(this).attr("data-id");

  
  $.ajax({
    method: "PUT",
    url: "/articles/unsave/" + id,
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
// 4. show the modal ($("#modalnote").modal("show"))

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
        let idNote = data.notes[i]._id
        console.log(title, comment)

        let tempNote = `<dic class="list-group-item list-group-item-action  mb-1">
        <div class="justify-content-between">
          <h5 class="mb-1">${title}</h5>
          <div class="row">
          <div class="col-11">
          <small>${comment}</small>
          </div>
          <div class="col-1">
          <button class="btn-sm btn-danger deletenote" data-toggle="modal" data-target="#modalnote" data-idNote="${idNote}" data-idArticle="${id}">X</button>
          </div>
        </div></div>`

        console.log(tempNote)

        $("#modalnote").find("#thenotes").append(tempNote);
      }


      let tempButton = (`<button class="btn-sm btn-success" id="savenote" data-toggle="modal" data-target="#modalnote" data-id="${id}">Add to Saved!</button>`)
      $("#modalnote").find("#buttonsaved").empty();
      $("#modalnote").find("#buttonsaved").append(tempButton);

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


$(document).on("click", ".deletenote", function () {
  console.log(".......deletenote")
  // Grab the id associated with the article from the submit button

  var idArticle = $(this).attr("data-idArticle");
  var idNote = $(this).attr("data-idNote");

    $.ajax({
      method: "DELETE",
      url: "/notes/delete/" + idNote,
    })
    
      .then(function (data) {
   
        console.log(data);
    
      });

  
  })

var topics = ["basketball", "baseball", "tennis", "cigars", "golf", "programmer", "cars", "morphing", "bourbon", "ping pong"];

// create buttons
function renderButtons(){
  $("#topicButtons").empty();
  topics.forEach(function(item) {
    var dyn = $('<button>', {
        class: "tbutton",
        text: item,
        id: item,
        topicData: item
    });
    $("#topicButtons").append(dyn);
  });
}

var srcStill = [];
var srcAnimate = []; 
var whichGif = 0;
var senseGif = 0;
var gifObj;

    // Event listener for all button elements
    function displayMovieInfo() {
      // In this case, the "this" keyword refers to the button that was clicked
      var topdat = encodeURI($(this).attr("topicData"));
      $("#gifs-appear-here").empty();
      console.log(topdat);
      // Constructing a URL to search Giphy for the name of the person who said the quote
      var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topdat + "&api_key=dc6zaTOxFJmzC&limit=10";
      // Performing our AJAX GET request
      $.ajax({
          url: queryURL,
          method: "GET"
        })
        // After the data comes back from the API
        .then(function(response) {
          // Storing an array of results in the results variable
          var results = response.data;
          // Looping over every result item
          for (var i = 0; i < results.length; i++) {
            // Only taking action if the video has an appropriate rating
            if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
              console.log(results[i].rating);
              // get the width of the image 
              var imgSize = parseInt(results[i].images.fixed_height.width); 
              // Creating a div with the class "item"
              var gifDiv = $("<div class='item'>").width(imgSize).css("float", "left");
              // Storing the result item's rating
              var rating = results[i].rating;
              // Creating a paragraph tag with the result item's rating
              var p = $("<p>").text("Rating: " + rating);
              // Creating an image tag
              var topicImage = $("<img class='gif'>").data("sig", {ind: i, sens: "animate"}).attr("src", results[i].images.fixed_height.url);
              // Giving the image tag a src attribute of a property pulled off the
              // result item
              srcStill[i] = results[i].images.fixed_height_still.url;
              srcAnimate[i] = results[i].images.fixed_height.url; 
              // Appending the paragraph and personImage we created to the "gifDiv" div we created
              gifDiv.append(p);
              // gifDiv.append(b);
              gifDiv.append(topicImage);
              // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
              $("#gifs-appear-here").append(gifDiv);
            }
          } 
        });
    }

    $("#add-topic").on("click", function(event) {
      // event.preventDefault();
      console.log(event);
        // This line of code will grab the input from the textbox
      var topic = $("#topic-input").val().trim();
      if (topic != ""){topics.push(topic)};
      $("#topic-input").val("");
        // The movie from the textbox is then added to our array
      // topics.push(topic);
      console.log(topics);
        // Calling renderButtons which handles the processing of our topic array
      renderButtons();

    });

    $(document).on("click", ".gif", function(){
        gifObj = $(this);
        console.log(this);
        whichGif = gifObj.data("sig").ind;
        senseGif = gifObj.data("sig").sens;
        console.log("Hi " + whichGif +""+ senseGif)
        if (senseGif === "animate"){
          $(this).attr("src", srcStill[whichGif]);
          $(this).data("sig", {ind: whichGif, sens: "still"});
        } else {
          $(this).attr("src", srcAnimate[whichGif]);
          $(this).data("sig", {ind: whichGif, sens: "animate"});
        }
    });

    $(document).on("click", ".tbutton", displayMovieInfo);
    renderButtons();
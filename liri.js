// Including my secret API keys
require("dotenv").config();
const keys = require("./keys.js");
// I don't quite understand how the below variables work
//const spotify = new Spotify(keys.spotify);
//const movies = new omdb(keys.omdb);

// Including the Axios package
const axios = require("axios");

// Variables to grab user search type and search value input
let search = process.argv[2].toLowerCase().trim();
let input = process.argv[3].toLowerCase().trim();



// Functions for each Liri command case

// Function to search Bands In Town for concert information
let concertSearch = function(){

}

// Function to search Spotify for song information
let songSearch = function() {

}

// Function to search OMDB for movie information
let movieSearch = function() {
    // variables for the information we want to save about each movie
    let movieTitle;
    let movieYear;
    let movieIMDBRating;
    let movieRTRating;
    let movieCountry;
    let movieLanguage;
    let moviePlot;
    let movieActors;
    // axios call to get the information we need about the movie
    axios.get("http://www.omdbapi.com/", {
        params: {
        // hardcoding my API key now for testing
          apikey: "1f6d3e5d",
          t: input,
        }
    }).then(function(response) {
              console.log(response);
            }).catch(function(error) {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
              }
              console.log(error.config);
      })
    }

    // Switch cases for the various Liri commands
switch (search) {
    case "concert-this":
        concertSearch();
        break;
    case "spotify-this-song":
        songSearch();
        break;
    case "movie-this":
        movieSearch();
        break;
    case "do-what-it-says":
        theThing();
        break;
}
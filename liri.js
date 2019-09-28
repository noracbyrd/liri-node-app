// Including my secret API keys
require("dotenv").config();
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);

// Variables to grab user search type and search value input
let search = process.argv[2];
let input = process.argv[3];

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
        doIt();
        break;
}

// Functions for each Liri command case

// Function to search Bands In Town for concert information
let concertSearch = function(){

}

// Function to search Spotify for song information
let songSearch = function() {

}

// Function to search OMDB for movie information
let movieSearch = function() {

}

// Function to reveal my secret song
let doIt = function() {

}
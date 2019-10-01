// Including my secret API keys
require("dotenv").config();
const keys = require("./keys.js");
const spotifyAPI = require('node-spotify-api');
const spotify = new spotifyAPI({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

const inquirer = require("inquirer");

// Including the fs package
const fs = require("fs");

// Including the Moment package
var moment = require('moment');

// Including the Axios package
const axios = require("axios");

// Variables to grab user search type and search value input
// let search = process.argv[2].toLowerCase().trim();
// let input = process.argv[3];

// function to get user input wihtout argv

var getError = function (error) {
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
}

var logLiri = function (newData) {
    fs.appendFile("log.txt", newData, function (err) {
        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.

    });
}
// Functions for each Liri command case

// Function to search Bands In Town for concert information
let concertSearch = function (concert) {
    switch (concert) {
        case "":
            let artist = "Rick Astley";
            axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsintown.id + "")
                .then(function (response) {
                    console.log("You didn't pick an artist so you get " + artist + ". This is why we can't have nice things!");
                    console.log("--------");
                    logLiri(`Concert search results for ${artist}: \n ******** \n`);
                    for (var i in response.data) {
                        console.log(`${response.data[i].venue.name} \n ${response.data[i].venue.city} \n ${(moment(response.data[i].datetime).format("MM/DD/YYYY"))} \n --------`);
                        logLiri(`${response.data[i].venue.name} \n ${response.data[i].venue.city} \n ${(moment(response.data[i].datetime).format("MM/DD/YYYY"))} \n -------- \n`);
                    }
                }).catch(getError);
            break;
        default:
            axios.get("https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp")
                .then(function (response) {
                    console.log("Upcoming concert info for " + concert + ":");
                    console.log("--------");
                    for (var i in response.data) {
                        console.log(response.data[i].venue.name);
                        console.log(response.data[i].venue.city);
                        // need to convert below via moment
                        console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
                        console.log("--------");
                    }

                }).catch(getError);
            break;
    }
}





// Function to search Spotify for song information
let songSearch = function (song) {

    switch (song) {
        case "":
            let songDefault = "Never Gonna Give You Up";
            spotify
                .search({
                    type: 'track',
                    query: songDefault,
                    limit: 1,
                })
                .then(function (response) {
                    console.log("GOTCHA!");
                    console.log("Artist: " + response.tracks.items[0].artists[0].name);
                    console.log("Song Name: " + response.tracks.items[0].name);
                    console.log("Song Preview Link: " + response.tracks.items[0].preview_url);
                    console.log("Album Name: " + response.tracks.items[0].album.name);
                })
                .catch(getError);
            break;
        default:
            spotify
                .search({
                    type: 'track',
                    query: song,
                    limit: 5,
                })
                .then(function (response) {
                    for (var i in response.tracks.items) {
                        console.log("Artist: " + response.tracks.items[i].artists[0].name);
                        console.log("Song Name: " + response.tracks.items[i].name);
                        console.log("Song Preview Link: " + response.tracks.items[i].preview_url);
                        console.log("Album Name: " + response.tracks.items[i].album.name);
                        console.log("--------");
                    }
                })
                .catch(getError);
            break;
    }
}



// Function to search OMDB for movie information
let movieSearch = function (movie) {

    // axios call to get the information we need about the movie
    switch (movie) {
        case "":
            axios.get("http://www.omdbapi.com/", {
                params: {
                    apikey: keys.omdb.id,
                    t: "Rick Astley: Never Gonna Give You Up",
                }
            }).then(function (response) {
                console.log(response.data.Title + " was released in " + response.data.Year + ".");
                console.log("It starred the following actors: " + response.data.Actors);
                console.log("The plot: " + response.data.Plot);

                console.log("Country: " + response.data.Country);

            }).catch(getError);
            break;
        default:
            axios.get("http://www.omdbapi.com/", {
                params: {
                    apikey: keys.omdb.id,
                    t: movie,
                }
            }).then(function (response) {
                console.log(response.data.Title + " was released in " + response.data.Year + ".");
                console.log("It starred the following actors: " + response.data.Actors);
                console.log("The plot: " + response.data.Plot);
                console.log("Ratings: IMDB: " + response.data.imdbRating + "; Rotten Tomatoes: " + response.data.Ratings[1].Value);
                console.log("Country: " + response.data.Country);
                // still need to include default case
            }).catch(getError);
            break;
    }
}

let theThing = function (text) {
    fs.readFile(text, "utf8", function (error, data) {
        if (error) {
            getError;
        }
        console.log(data);
        var randomLiri = data.split(",");
        var [randomLiriCommand, randomLiriSearch] = randomLiri;
        switch (randomLiriCommand) {
            case "concert-this":
                concertSearch(randomLiriSearch);
                break;
            case "spotify-this-song":
                songSearch(randomLiriSearch);
                break;
            case "movie-this":
                movieSearch(randomLiriSearch);
                break;
        }
    })
}


inquirer
    .prompt([
        {
            type: "list",
            message: "What should Liri do?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "liriCommand"
        },
        {
            type: "input",
            message: "What would you like to search?",
            name: "input"
        },
    ]).then(function (inquirerResponse) {
        // Switch cases for the various Liri commands
        console.log(typeof inquirerResponse.liriCommand);
        switch (inquirerResponse.liriCommand) {
            case "concert-this":
                concertSearch(inquirerResponse.input);
                break;
            case "spotify-this-song":
                songSearch(inquirerResponse.input);
                break;
            case "movie-this":
                movieSearch(inquirerResponse.input);
                break;
            case "do-what-it-says":
                theThing(inquirerResponse.input);
                break;
        }
    });



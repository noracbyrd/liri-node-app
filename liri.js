// Including my secret API keys
require("dotenv").config();
const keys = require("./keys.js");
const spotifyAPI = require('node-spotify-api');
const spotify = new spotifyAPI({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

// Including the packages relevant for Liri
const inquirer = require("inquirer");
const fs = require("fs");
var moment = require('moment');
const axios = require("axios");

// Generic error function so I don't have to type this a million times
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

// Function to log search results to a document called log.txt. This function will be called in the individual Liri functions below.
var liriLog = function (newData) {
    fs.appendFile("log.txt", newData, function (err) {
        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }
        // Omitting an 'added this' confirmation because it got excessive for the functions with loops.
    });
}


// Functions for each Liri command case

// Function to search Bands In Town for concert information
let concertSearch = function (concert) {
    switch (concert) {
        // Case for if the user doesn't enter anything:
        case "":
            let artist = "Rick Astley";
            axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsintown.id + "")
                .then(function (response) {
                    // Printing both to the console and to the Liri log text file:
                    console.log(`You didn't pick an artist so you get ${artist}. This is why we can't have nice things! \n ******** \n`);
                    liriLog(`Concert search results for ${artist}: \n ******** \n`);
                    // For loop to print out the upcoming concert data:
                    for (var i in response.data) {
                        console.log(`${response.data[i].venue.name} \n ${response.data[i].venue.city} \n ${(moment(response.data[i].datetime).format("MM/DD/YYYY"))} \n --------`);
                        liriLog(`${response.data[i].venue.name} \n ${response.data[i].venue.city} \n ${(moment(response.data[i].datetime).format("MM/DD/YYYY"))} \n -------- \n`);
                    }
                    // if there's an error, run the error function:
                }).catch(getError);
            break;
        // case for when the user enters an artist:
        default:
            // Axios call for Bands In Town
            axios.get("https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp")
                .then(function (response) {
                    // printing/logging what the user searched for
                    console.log(`Upcoming concert info for ${concert}: \n ******** \n`);
                    liriLog(`Concert search results for ${concert}: \n ******** \n`);
                    for (var i in response.data) {
                        // printing/logging the concert data
                        console.log(`${response.data[i].venue.name} \n ${response.data[i].venue.city} \n ${(moment(response.data[i].datetime).format("MM/DD/YYYY"))} \n --------`);
                        liriLog(`${response.data[i].venue.name} \n ${response.data[i].venue.city} \n ${(moment(response.data[i].datetime).format("MM/DD/YYYY"))} \n -------- \n`);
                    }
                }).catch(getError);
            break;
    }
}

// Function to search Spotify for song information
let songSearch = function (song) {
    // this follows the structure of the above concert function - data grabbed, data printed to console and Liri log etc etc
    switch (song) {
        // case for if the user doesn't enter a song (are you sensing a theme here):
        case "":
            let songDefault = "Never Gonna Give You Up";
            // using special Spotify node package
            spotify
                // for the default case, we're only returning one result
                .search({
                    type: 'track',
                    query: songDefault,
                    limit: 1,
                })
                .then(function (response) {
                    // print/log relevant song info
                    console.log(`RICKROLL! \n Artist: ${response.tracks.items[0].artists[0].name} \n Song Name: ${response.tracks.items[0].name} \n Song Preview Link: ${response.tracks.items[0].preview_url} \n Album Name: ${response.tracks.items[0].album.name} \n ******** \n`);
                    liriLog(`RICKROLL! Your song search results:\n Artist: ${response.tracks.items[0].artists[0].name} \n Song Name: ${response.tracks.items[0].name} \n Song Preview Link: ${response.tracks.items[0].preview_url} \n Album Name: ${response.tracks.items[0].album.name} \n ******** \n`);
                })
                .catch(getError);
            break;
        // case for when the user enters a song:
        default:
            spotify
                // returning five songs for a user search since I was offended when the first answer returned when searching God Only Knows was NOT the Beach Boys
                .search({
                    type: 'track',
                    query: song,
                    limit: 5,
                })
                .then(function (response) {
                    // print/log the song searched
                    console.log(`Search results for ${song}: \n`);
                    liriLog(`Search results for ${song}: \n`);
                    for (var i in response.tracks.items) {
                        // print/log relevant song info for the 5 results
                        console.log(`Artist: ${response.tracks.items[i].artists[0].name} \n Song Name: ${response.tracks.items[i].name} \n Song Preview Link: ${response.tracks.items[i].preview_url} \n Album Name: ${response.tracks.items[i].album.name} \n ******** \n`);
                        liriLog(`******** \n Artist: ${response.tracks.items[i].artists[0].name} \n Song Name: ${response.tracks.items[i].name} \n Song Preview Link: ${response.tracks.items[i].preview_url} \n Album Name: ${response.tracks.items[i].album.name} \n`);
                    }
                })
                .catch(getError);
            break;
    }
}

// Function to search OMDB for movie information
let movieSearch = function (movie) {
    // follows previous function format like song search and concert search
    switch (movie) {
        // case for if the user doesn't enter a movie
        case "":
            axios.get("http://www.omdbapi.com/", {
                params: {
                    apikey: keys.omdb.id,
                    // yes, reader, there is an omdb entry for Never Gonna Give You Up's music video:
                    t: "Rick Astley: Never Gonna Give You Up",
                }
            }).then(function (response) {
                // print/log the movie info
                console.log(`\n ******** \n Tee hee. ${response.data.Title} was released in ${response.data.Year}. \n It starred the following actors: ${response.data.Actors} \n The plot: ${response.data.Plot} \n Country: ${response.data.Country} \n ******** \n`);
                liriLog(`\n ******** \n Tee hee. ${response.data.Title} was released in ${response.data.Year}. \n It starred the following actors: ${response.data.Actors} \n The plot: ${response.data.Plot} \n Country: ${response.data.Country} \n ******** \n`);
            }).catch(getError);
            break;
        default:
            // case for when user enters a movie to search
            // axios call for the OMDB
            axios.get("http://www.omdbapi.com/", {
                params: {
                    apikey: keys.omdb.id,
                    t: movie,
                }
            }).then(function (response) {
                // print/log the relevant infor about the movie search 
                console.log(`\n ******** \n ${response.data.Title} was released in ${response.data.Year}. \n It starred the following actors: ${response.data.Actors} \n The plot: ${response.data.Plot} \n Ratings: IMDB: ${response.data.imdbRating}; Rotten Tomatoes: ${response.data.Ratings[1].Value} \n Country: ${response.data.Country} \n ******** \n`);
                liriLog(`\n ******** \n ${response.data.Title} was released in ${response.data.Year}. \n It starred the following actors: ${response.data.Actors} \n The plot: ${response.data.Plot} \n Ratings: IMDB: ${response.data.imdbRating}; Rotten Tomatoes: ${response.data.Ratings[1].Value} \n Country: ${response.data.Country} \n ******** \n`);
            }).catch(getError);
            break;
    }
}

// Function for reading instructions from the random.txt file and following the instructions
let theThing = function (text) {
    switch (text) {
        // if the user doesn't enter any file name
        case "":
            console.log("You need to enter a file!");
            break;
        // user entered an extant file name:
        default:
            fs.readFile(text, "utf8", function (error, data) {
                if (error) {
                    getError;
                }
                var randomLiri = data.split(",");
                //I know there's only two files in the random txt file, so I can deconstruct it as follows:
                var [randomLiriCommand, randomLiriSearch] = randomLiri;
                // switch case to account for the possible Liri commands:
                switch (randomLiriCommand) {
                    // depending on what the command is from the text file, we'll use the second item in the text file as the argument for the function we're running
                    case "concert-this":
                        concertSearch(randomLiriSearch);
                        break;
                    case "spotify-this-song":
                        songSearch(randomLiriSearch);
                        break;
                    case "movie-this":
                        movieSearch(randomLiriSearch);
                        break;
                    // I'm kiiiind of copping out with the default below, but needed to account for if the info in the file was somehow not in the expected format above
                    default:
                        console.log("There wasn't a Liri command to follow!");
                }
            })
            break;
    }
}

// getting user input to actually run Liri
inquirer
    .prompt([
        {
            // which command should Liri run?
            type: "list",
            message: "What should Liri do?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "liriCommand"
        },
        {
            // what should Liri search for?
            type: "input",
            // had to explain in the message that the do-what-it-says has to search a specific file. Not ideal, but we'll live
            message: "What would you like to search?  Note: if you selected the do-what-it-says command, enter what file name you want to search! Hint: it's random.txt",
            name: "input"
        },
    ]).then(function (inquirerResponse) {
        // Switch cases for the various Liri commands - each case calls the corresponding function
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

// link to my profile: https://noracbyrd.github.io/Bootstrap_Portfolio/portfolio.html

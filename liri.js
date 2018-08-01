require("dotenv").config();
var inquirer = require("inquirer");
var request = require("request");
var Spotify = require('node-spotify-api');
var fs = require("fs");

var keys = require("./keys.js");
var Twitter = require("twitter");

var nodeArgs = process.argv;

var command = process.argv[2];
var search = "";

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        search = search + "+" + nodeArgs[i];
    }
    else {
        search += nodeArgs[i];
    }
}



// Twitter commands
if (command === "my-tweets") {
    client.get('statuses/user_timeline', function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("My Tweets: \n" + tweets[i].text + "\n" + "Created at: " + tweets[i].created_at);
            }  // end for loop
        }
    }); // end get request
}



// Spotify Commands
if (command === "spotify-this-song") {
        if (process.argv[3] === undefined) {
            search = "The Sign Ace of Base";
        }

    spotify.search({ type: "track", query: search, limit: 20 }, function (err, qs) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Track Name: " + qs.tracks.items[0].name);
        console.log("Artist(s): " + qs.tracks.items[0].artists[0].name);
        console.log("Preview Link: " + qs.tracks.items[0].preview_url);
        console.log("Album: " + qs.tracks.items[0].album.name);
    });
}




// Movie Commands

if (command === "movie-this") {
    if (process.argv[3] === undefined) {
        search = "Mr. Nobody";
    }
    
    var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country of production: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}


// Movie Commands
if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        spotify.search({ type: "track", query: dataArr[1], limit: 20 }, function (err, qs) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log("Track Name: " + qs.tracks.items[0].name);
            console.log("Artist(s): " + qs.tracks.items[0].artists[0].name);
            console.log("Preview Link: " + qs.tracks.items[0].preview_url);
            console.log("Album: " + qs.tracks.items[0].album.name);
        });


    });
} 
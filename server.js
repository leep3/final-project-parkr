var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var NodeGeocoder = require('node-geocoder');
var modRequest = require('request');
var Promise = require('promise-simple');
var geolib = require('geolib');
var availSpots
fs.readFile('./spots.json', 'utf-8', function(err, data){
	availSpots = JSON.parse(data);
});
//Google reverse lookup setup - used to get lat/long from address
var options = {
	provider: 'google',
	apiKey: 'AIzaSyCF1KRcmH0u-Rn13HUj--5vhMjZe4Cltus',
	formatter: null
};

var geocoder = NodeGeocoder(options);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var load = false;
var serverFiles = [];
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//Setup function variable for geo lookup
var geocodeLoc = function(location){
	var result;
    var d = Promise.defer();
    var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location;
	modRequest(baseURL, function(e, r, b){
		if(!e && r.statusCode == 200){
			console.log(JSON.parse(b).results[0].geometry);
			result = (JSON.parse(b).results[0].geometry.location);
			console.log(result);
			d.resolve(result);
		}else{
			d.reject(e);
		}
	});
    return d;
}

//Load files from public folder
function loadFiles(){
	fs.readdir("public/", function(err, files){
		if(err){
			console.log("Error reading dir");
		}
		files.forEach(function(file){
			fs.readFile("public/" + file, "utf-8", function(err, content){
				if(err){
					console.log("Error reading " + file);
				}
				else{
					serverFiles['/' + file] = content;
				}
			});
		});
	});
	loadFiles = true;
}

function searchSpots(address, radius){
	
}

//Check if files have been loaded
if(!load){
	//If not, load them now
	loadFiles();
}

app.get('/', function(req, res, next){
	res.type(path.extname('mainpage.html'));
	res.send(serverFiles['/mainpage.html']);
});

app.post('/search', function(req, res){
	//Get the user input for address and radius
	var address = req.body.search.city;
	//Convert to an int
	var radius = parseInt(req.body.search.days);
	//Get desired days
	//var days = req.body.search.days;

	//Create empty object array
	var matchingSpots = {};
	matchingSpots['key'] = [];
		
	//Get the latitude and longitude for the entered address
	geocoder.geocode(address, function(err, resp){
		//Store it as an object for later comparison
		var latlng = {latitude: resp[0].latitude, longitude: resp[0].longitude};
	
		
		//Loop through all the spots in the JSON file 
		for(var spot of availSpots){
			//Get the lat/long of the current spot
			var spotCoords = {latitude: spot.lat, longitude: spot.lng};
			
			//Check if it is within the radius, convert returned meters to miles
			if(geolib.getDistance(spotCoords, latlng, 10) < (radius * 1609)){
				//If so, add it to the array
				matchingSpots['key'].push(spot);
				console.log('match');
			}
		}
		
		var templateArgs = {
			spots: matchingSpots['key']
		};
		console.log(matchingSpots['key']);
		res.render('parkrTemplate', templateArgs);
	});

});

app.get('*', function(req, res, next){
	if(serverFiles[req.url] != undefined){
		//Check for image request
		if(path.extname(req.url) == '.jpg'){
			//Send image
			res.sendFile(__dirname + '/public/' + req.url);
		}
		//Else, send the file
		else{
			res.type(path.extname(req.url));
			res.send(serverFiles[req.url]);
		}
	}
	else{
		next();
	}
});

app.get('*', function(req, res, next){
	res.status(404).render('404Page');
});
// Start the server listening on the specified port.
app.listen(port, function () {
  console.log("== Server listening on port", port);
});
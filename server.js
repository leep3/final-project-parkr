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
var availSpots;
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

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var load = false;
var serverFiles = [];
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//Keep track if spots are modified and need to be saved
var spotChange = false;

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

//Check if files have been loaded
if(!load){
	//If not, load them now
	loadFiles();
}

app.get('/', function(req, res, next){
	res.render('index');
});

app.post('/search', function(req, res){
	//Get the user input for address and radius
	var address = req.body.search.city;
	//Convert to an int
	var radius = parseInt(req.body.search.radius);

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
			
			//Check if it is within the radius, convert returned meters to miles, and available
			if((geolib.getDistance(spotCoords, latlng, 10) < (radius * 1609)) && (spot.avail)){
				//If so, add it to the array
				matchingSpots['key'].push(spot);
			}
		}
		
		var templateArgs = {
			spaceData: matchingSpots['key']
		};

		res.render('mainPage', templateArgs);
	});

});

//Function for adding spots
app.post('/add', function(req, res, next){
	//Get the lat/long of the address for easier searching later
	geocoder.geocode(req.body.Address + " " + req.body.City, function(err, resp){
		//Create a new spot object
		var newSpot = {
			Name: req.body.Name,
			Address: req.body.Address,
			City: req.body.City,
			Price: req.body.Price,
			Day: req.body.Day,
			Picture: req.body.Picture,
			Description: req.body.Description,
			lat: resp[0].latitude,
			lng: resp[0].longitude,
			avail: true
		};
		
		//Add the new spot to the array 
		availSpots.push(newSpot);
		
		//Save the updated array to the spot.json
		fs.writeFile("./spots.json", JSON.stringify(availSpots), function(err){
			if(err){
				console.log(err);
			}
		});
	});
});

//Remove a spot
app.post('/delete', function(req, res, next){
	//Get the address from the spot to be deleted
	var spotAddress = req.body.Address.split(": ")[1];
	//Loop through the spots until we find a match
	for(var spot of availSpots){
		//Check for a match, convert to uppercase for case insenitive search
		if(spot.Address.toUpperCase() == spotAddress.toUpperCase()){
			//Take out the spot and reform the array
			availSpots.splice(availSpots.indexOf(spot), 1);
			//Let the browser know it was successful
			res.status(200).send();
			break;
		}
	}
});

//Reserve spot
app.post('/reserve', function(req, res, next){
	//Get the address from the spot to be reserved
	var spotAddress = req.body.Address.split(": ")[1];
	//Loop through the spots until we find a match
	for(var spot of availSpots){
		//Check for a match, convert to uppercase for case insenitive search
		if(spot.Address.toUpperCase() == spotAddress.toUpperCase()){
			//Change the availability to false
			availSpots.indexOf(spot).avail = false;
			//Let the browser know it was successful
			res.status(200).send();
			break;
		}
	}
});
app.get('*', function(req, res, next){
	if(req.url.charAt(0) != '/'){
		var reqUrl = '/' + req.url;
	}
	else{
		var reqUrl = req.url;
	}
	if(serverFiles[reqUrl] != undefined){
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

//Save the JSON before closing
//process.stdin.resume();
/*
function exitHandler(){
	console.log(availSpots);
	if(spotChange){
		fs.writeFile(__dirname + '/spots.json', availSpots, function(err){
			if(err){
				console.log(err);
			}
		});
	}
}

//do something when app is closing
process.on('exit', exitHandler.bind());

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind());

//catches uncaught exceptions
//process.on('uncaughtException', exitHandler.bind());*/

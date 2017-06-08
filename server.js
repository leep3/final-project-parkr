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
	var templateArgs = {
		
	};
	
	res.render('index', templateArgs);
});
/*
[ { formattedAddress: '89596 Demming Rd, Elmira, OR 97437, USA',
    latitude: 44.0899659,
    longitude: -123.353313,
    extra:
     { googlePlaceId: 'ChIJMSU5pBMFwVQRi38uqDegqZ4',
       confidence: 1,
       premise: null,
       subpremise: null,
       neighborhood: null,
       establishment: null },
    administrativeLevels:
     { level2long: 'Lane County',
       level2short: 'Lane County',
       level1long: 'Oregon',
       level1short: 'OR' },
    streetNumber: '89596',
    streetName: 'Demming Road',
    city: 'Elmira',
    country: 'United States',
    countryCode: 'US',
    zipcode: '97437',
    provider: 'google' } ]
	console.log(resp[0].latitude);*/
	
	/*
	[
		{
			"spots": {
				[],[]
			}
		}
	]
*/

app.post('/search', function(req, res){
	var address = req.body.search.city;
	var radius = parseInt(req.body.search.radius);

	geocoder.geocode(address, function(err, resp){
		var latlng = {latitude: resp[0].latitude, longitude: resp[0].longitude};

		var matchingSpots = {};
		matchingSpots['key'] = [];

		for(var spot of availSpots){
			var spotCoords = {latitude: spot.lat, longitude: spot.lng};
			if(geolib.getDistance(spotCoords, latlng, 10) < (radius * 1609)){
				matchingSpots['key'].push(spot);
			}
		}
		console.log(matchingSpots);
	});
	
	var templateArgs = {
		
	};
	
	res.render('parkrTemplate', templateArgs);
});

app.get('*', function(req, res, next){
	if(serverFiles[req.url] != undefined){
		res.type(path.extname(req.url));
		res.send(serverFiles[req.url]);
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
/*****************************

Carl Benson

*****************************/

var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');

var twitData = require('./twitData.json');

var app = express();
var port = process.env.PORT || 3000;

var twitPage = fs.readFileSync('./views/twitPage.handlebars', 'utf8');
var errorPage = fs.readFileSync('./views/404Page.handlebars', 'utf8');
var headerPart = fs.readFileSync('./views/partials/header.handlebars', 'utf8');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var load = false;
var serverFiles = [];

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
	var templateArgs = {
		header: headerPart,
		twits: twitData
	};
	
	res.render('twitPage', templateArgs);
});

app.get('*', function(req, res, next){
	console.log(req.url);
	if(serverFiles[req.url] != undefined){
		res.type(path.extname(req.url));
		res.send(serverFiles[req.url]);
	}
	else{
		next();
	}
});

app.get('*', function(req, res, next){
	var templateArgs = {
		header: headerPart
	};
	
	res.status(404).render('404Page', templateArgs);
});
// Start the server listening on the specified port.
app.listen(port, function () {
  console.log("== Server listening on port", port);
});
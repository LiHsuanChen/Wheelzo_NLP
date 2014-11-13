
/**
 * Module dependencies.
 */
var environments = "production";
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var jsonParser = bodyParser.json()

var navi = require('./routes/navigation');
var http = require('http');
var path = require('path');


// all environments
if (environments == "development"){
	var port = process.env.PORT || 3000;
	var ipaddress = null;
}
else if (environments == "production"){
	var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
	var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.get('/', navi.index);
app.get('/restTest', navi.restTest);
app.post('/nlpApi', jsonParser , navi.nlpApi);


http.createServer(app).listen(port, ipaddress , function(){
  console.log('Express server running');
});

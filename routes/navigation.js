var checkMessage    = require('../core/checkMessage'),
    timeTracker     = require('../core/timeTracker'),
    priceTracker    = require('../core/priceTracker'),
    locationTracker = require('../core/locationTracker');

function apiResponse(){
	this.origin = null;
	this.destination = null;
	this.departure = null;
	this.capacity = null;
	this.price = null;
}

function capatilzieString( string ){
  if (string){
    string = string.split(" ");
    string.forEach(function(element, index, array){
      if( element[0] ){
        array[index] = element && element[0].toUpperCase() + element.slice(1);
      }
    });
    var captedString = string.join(" ");
    return captedString;
  }
  else {
    return null;
  }
}

/*
 * GET index
 */
exports.index = function(req, res){
  res.render('index');
};

/*
 * GET testing endpoint
 */
exports.restTest = function(req, res){

  var message = "Driving from Waterloo to Toronto (eatons/fairview) Saturday Nov 1st around 2-3pm, 2 seats Also Driving Toronto (markham area) to Waterloo Sunday Nov2nd around 10AM, 2 seats $10 Inbox ASAP";
  var timestamp = "2014-11-03T04:13:59+0000";

  var api = new apiResponse();

  var isdriver = checkMessage.isDriver(message);

  if (isdriver){
    var locationResult = locationTracker.searchLocation(message);
    var priceCheckResult = priceTracker.searchPrice(message);

    api.origin = capatilzieString(locationResult.origin);
    api.destination = capatilzieString(locationResult.destination);
    api.departure = timeTracker.extractDeparture(message, timestamp);
    api.capacity = null;
    api.price = priceCheckResult.price;
  }


  res.json(api);
};


/*
 * POST Wheelzo NLP Api
 */
 exports.nlpApi = function(req, res){

console.log("C-TYPE: " + req.get('content-type'))
console.log("BODY: " + req.body);

  var request = req.body,
      api = new apiResponse();

 	var isdriver = checkMessage.isDriver(request.message);

 	if (isdriver){
 		var locationResult = locationTracker.searchLocation(request.message);
    var priceCheckResult = priceTracker.searchPrice(request.message);

 		api.origin = capatilzieString(locationResult.origin);
 		api.destination = capatilzieString(locationResult.destination);
 		api.departure = timeTracker.extractDeparture(request.message, request.timestamp);
 		api.capacity = null;
 		api.price = priceCheckResult.price;
 	}

 	res.json(api);
 }
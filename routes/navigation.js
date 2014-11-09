var checkMessage = require('../core/checkMessage');
var timeTracker = require('../core/timeTracker');
var priceTracker = require('../core/priceTracker');
var locationTracker = require('../core/locationTracker');

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
 * POST Wheelzo NLP Api
 */
 exports.nlpApi = function(req, res){
  //console.log(req.body);
 	var isdriver = checkMessage.isDriver(req.body.message);

 	var api = new apiResponse();
 	
 	if (isdriver){
 		var locationResult = locationTracker.searchLocation(req.body.message);
 		api.origin = capatilzieString(locationResult.origin);
 		api.destination = capatilzieString(locationResult.destination);
 		api.departure = timeTracker.extractDeparture(req.body.message, req.body.timestamp);
 		api.capacity = null;
 		var priceCheckResult = priceTracker.searchPrice(req.body.message);
 		api.price = priceCheckResult.price;
 	}
 	
 	res.json(api);
 }
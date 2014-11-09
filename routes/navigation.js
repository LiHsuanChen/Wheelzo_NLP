var checkMessage = require('../core/checkMessage'),
    timeTracker = require('../core/timeTracker'),
    priceTracker = require('../core/priceTracker'),
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
 * POST Wheelzo NLP Api
 */
 exports.nlpApi = function(req, res){
  var request = req.body,
      api = new apiResponse();

 	var isdriver = checkMessage.isDriver(request.message);

 	
 	
 	if (isdriver){
 		var locationResult = locationTracker.searchLocation(request.message);
 		api.origin = capatilzieString(locationResult.origin);
 		api.destination = capatilzieString(locationResult.destination);
 		api.departure = timeTracker.extractDeparture(request.message, request.timestamp);
 		api.capacity = null;
 		var priceCheckResult = priceTracker.searchPrice(request.message);
 		api.price = priceCheckResult.price;
 	}
 	
 	res.json(api);
 }
var config 		= require('./unitTest.json'),
	testCases 	= require('./testCases.json'),
	numTests	= testCases.length;


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

function testCaseManager( config ){

	var conf = {};

	if (config.testAllCases){
		conf.start = 0;
		conf.end = numTests;
	}
	else {
		conf.start = config.testFromCase;
		conf.end = config.testToCase + 1;
	}

	return conf;
}

function checkMessageTest( config, checkMessage ){

	var test = testCaseManager(config); 

	for( var i = test.start; i < test.end; i++ ){

		var a_isDriver = checkMessage.isDriver(testCases[i].message);

		if (a_isDriver == testCases[i].e_isDriver){
			console.log("PASS");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_isDriver);
			console.log("Actual: " + a_isDriver);
		}
		else{
			console.log("FAIL");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_isDriver);
			console.log("Actual: " + a_isDriver);
		}
	}
}

function originTest( config, locationTracker ){

	var test = testCaseManager(config);

		for( var i = test.start; i < test.end; i++ ){

		var location = locationTracker.searchLocation(testCases[i].message),
			a_origin = capatilzieString(location.origin);

		if (a_origin == testCases[i].e_origin){
			console.log("PASS");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_origin);
			console.log("Actual: " + a_origin);
		}
		else{
			console.log("FAIL");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_origin);
			console.log("Actual: " + a_origin);
		}
	}
}


function destinationTest( config, locationTracker ){

	var test = testCaseManager(config);

		for( var i = test.start; i < test.end; i++ ){

		var location = locationTracker.searchLocation(testCases[i].message),
			a_destination = capatilzieString(location.destination);

		if (a_destination == testCases[i].e_destination){
			console.log("PASS");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_destination);
			console.log("Actual: " + a_destination);
		}
		else{
			console.log("FAIL");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_destination);
			console.log("Actual: " + a_destination);
		}
	}
}

function departureTest( config, timeTracker ){

	var test = testCaseManager(config);

		for( var i = test.start; i < test.end; i++ ){

		var a_departure = timeTracker.extractDeparture(testCases[i].message, testCases[i].timestamp);

		if (a_departure == testCases[i].e_departure){
			console.log("PASS");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("TimeStamp: " + testCases[i].timestamp)
			console.log("Expected: " + testCases[i].e_departure);
			console.log("Actual: " + a_departure);
		}
		else{
			console.log("FAIL");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("TimeStamp: " + testCases[i].timestamp)
			console.log("Expected: " + testCases[i].e_departure);
			console.log("Actual: " + a_departure);
		}
	}
}

function priceTest( config, priceTracker ){

	var test = testCaseManager(config);

		for( var i = test.start; i < test.end; i++ ){

		var priceCheck = priceTracker.searchPrice(testCases[i].message),
			a_price = priceCheck.price;

		if (a_price == testCases[i].e_price){
			console.log("PASS");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_price);
			console.log("Actual: " + a_price);
		}
		else{
			console.log("FAIL");
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_price);
			console.log("Actual: " + a_price);
		}
	}
}

function capacityTest( config ){
	//nada
}

function run(){
	
	if( config.isDriver.testOn ){
	checkMessageTest(config.isDriver, require('../core/checkMessage'));
	}
	if ( config.origin.testOn ){
		originTest(config.origin), require('../core/locationTracker');;
	}
	if ( config.destination.testOn ){
		destinationTest(config.destination, require('../core/locationTracker'));
	}
	if ( config.departure.testOn ){
		departureTest(config.departure, require('../core/timeTracker'));
	}
	if ( config.price.testOn ){
		priceTest(config.price, require('../core/priceTracker'));
	}
	if ( config.capacity.testOn ){
		capacityTest(config.capacity);
	}
}

run();
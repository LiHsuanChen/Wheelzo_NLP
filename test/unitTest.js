var config 		= require('./unitTest.json'),
	testCases 	= require('./testCases.json'),
	colors		= require('colors'),
	numTests	= testCases.length;
	dashLine	= "------------------------------------------------------------------------------------------------------------------------------------".bgWhite;
	asterisk	= "************************************************************************************************************************************".bgBlack;
	pass 		= "PASS".green.bold;
	fail 		= "FAIL".bgRed.white.bold;


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

function printTestResult(numTest, numPass, numFails, failId, testName){

	console.log("")
	console.log(( "<< " + testName + " Result >> ").bold.blue);
	console.log(("   Num Tests Ran: " + numTest).bold.blue);
	console.log(("   Num Tests Failed: " + numFail).bold.blue);
	console.log(("   Num Tests Passed: " + numPass).bold.blue);
	console.log(("   Pass Rate: " + ((numPass/numTest)*100).toFixed(1) + "%").bold.blue);
	console.log(("   Failed Ids: { " + failId + " }").bold.blue);
	console.log("");

}

function checkMessageTest( config, checkMessage ){

	var test 	= testCaseManager(config),
		numTest = 0;
		numFail = 0,
		numPass	= 0;
		failId  = [];

	console.log(asterisk);
	console.log("*************************************************** STARTING CHECK MESSAGE TESTS ***************************************************".bgWhite);
	console.log(asterisk);

	for( var i = test.start; i < test.end; i++ ){

		numTest++;

		var a_isDriver = checkMessage.isDriver(testCases[i].message);

		if (a_isDriver == testCases[i].e_isDriver){
			numPass++;
			console.log(pass);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_isDriver);
			console.log("Actual: " + a_isDriver);
			console.log(dashLine);
		}
		else{
			numFail++;
			failId.push(testCases[i].id);
			console.log(fail);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_isDriver);
			console.log("Actual: " + a_isDriver);
			console.log(dashLine);
		}
	}

	printTestResult(numTest, numPass, numFail, failId, "Check Message Test");

}

function originTest( config, locationTracker ){

	var test 	= testCaseManager(config),
		numTest = 0;
		numFail = 0,
		numPass	= 0;
		failId  = [];

	console.log(asterisk);
	console.log("************************************************** STARTING ORIGIN LOCATION TESTS **************************************************");
	console.log(asterisk);

	console.log("Staring Origin Test");

	for( var i = test.start; i < test.end; i++ ){

		numTest++;

		var location = locationTracker.searchLocation(testCases[i].message),
			a_origin = location.origin;

		if (a_origin == testCases[i].e_origin){
			numPass++;
			console.log(pass);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_origin);
			console.log("Actual: " + a_origin);
			console.log(dashLine);
		}
		else{
			numFail++;
			failId.push(testCases[i].id);
			console.log(fail);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_origin);
			console.log("Actual: " + a_origin);
			console.log(dashLine);
		}
	}

	printTestResult(numTest, numPass, numFail, failId, "Origin Location Test");
}


function destinationTest( config, locationTracker ){

	var test 	= testCaseManager(config),
		numTest = 0;
		numFail = 0,
		numPass	= 0;
		failId  = [];

		console.log(asterisk);
		console.log("*********************************************** STARTING DESTINATION LOCATION TESTS ************************************************");
		console.log(asterisk);

	for( var i = test.start; i < test.end; i++ ){

		numTest++;

		var location = locationTracker.searchLocation(testCases[i].message),
			a_destination = location.destination;

		if (a_destination == testCases[i].e_destination){
			numPass++;
			console.log(pass);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_destination);
			console.log("Actual: " + a_destination);
			console.log(dashLine);
		}
		else{
			numFail++;
			failId.push(testCases[i].id);
			console.log(fail);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_destination);
			console.log("Actual: " + a_destination);
			console.log(dashLine);
		}
	}
	printTestResult(numTest, numPass, numFail, failId, "Destination Location Test");
}

function departureTest( config, timeTracker ){

	var test 	= testCaseManager(config),
		numTest = 0;
		numFail = 0,
		numPass	= 0;
		failId  = [];

	console.log(asterisk);
	console.log("*************************************************** STARTING DEPARTURE TIME TESTS **************************************************");
	console.log(asterisk);

	for( var i = test.start; i < test.end; i++ ) {

		numTest++;

		var a_departure = timeTracker.extractDeparture(testCases[i].message, testCases[i].timestamp);

		if (a_departure == testCases[i].e_departure){
			numPass++;
			console.log(pass);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("TimeStamp: " + testCases[i].timestamp)
			console.log("Expected: " + testCases[i].e_departure);
			console.log("Actual: " + a_departure);
			console.log(dashLine);
		}
		else{
			numFail++;
			failId.push(testCases[i].id);
			console.log(fail);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("TimeStamp: " + testCases[i].timestamp)
			console.log("Expected: " + testCases[i].e_departure);
			console.log("Actual: " + a_departure);
			console.log(dashLine);
		}
	}
	printTestResult(numTest, numPass, numFail, failId, "Departure Time Test");
}

function priceTest( config, priceTracker ){

	var test 	= testCaseManager(config),
		numTest = 0;
		numFail = 0,
		numPass	= 0;
		failId  = [];

	console.log(asterisk);
	console.log("**************************************************** STARTING PRICE CHECK TESTS ****************************************************");
	console.log(asterisk);

	for( var i = test.start; i < test.end; i++ ){

		numTest++;

		var priceCheck = priceTracker.searchPrice(testCases[i].message),
			a_price = priceCheck.price;

		if (a_price == testCases[i].e_price){
			numPass++;
			console.log(pass);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_price);
			console.log("Actual: " + a_price);
			console.log(dashLine);
		}
		else{
			numFail++;
			failId.push(testCases[i].id);
			console.log(fail);
			console.log("id: " + testCases[i].id);
			console.log("Message: " + testCases[i].message);
			console.log("Expected: " + testCases[i].e_price);
			console.log("Actual: " + a_price);
			console.log(dashLine);
		}
	}
	printTestResult(numTest, numPass, numFail, failId, "Price Check Test");
}

function capacityTest( config ){
	//nada
}

function run(){
	
	if( config.isDriver.testOn ){
	checkMessageTest(config.isDriver, require('../core/checkMessage'));
	}
	if ( config.origin.testOn ){
		originTest(config.origin, require('../core/locationTracker'));
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
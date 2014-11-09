/*
 * Starting from here
 */
exports.searchLocation = function( message ){

	//Do some cleanup
	message = cleanUpMessage(message);
	//Searching for primary indicators
	var result = findPrimaryIndicators(message);

	//Alpha case, presumebly we do not need to search for secondary indicators
	if (result.numOfFrom > 0 && result.numOfTo > 0) {
		result = primaryIndicatorResultAlpha(message, result);
	}
	//Missing 'to'
	else if (result.numOfFrom > 0 && result.numOfTo == 0 ){
		if ( result.numOfArrow == 0 ){
			//Try to match with location keywords dictionary
			console.log("We are missing 'to' or '>' indicators");
		}
		else if (result.numOfArrow > 0) {
			//This should not be gamma, because you wanna consider the exist of 'from'
			result = primaryIndicatorResultGamma( message, result );
		}
	}
	//Missing 'from'
	else if (result.numOfFrom == 0 && result.numOfTo > 0){
		result = primaryIndicatorResultBeta(message, result);
	}
	//Missing both 'from' & 'to'
	else if (result.numOfFrom == 0 && result.numOfTo == 0){

		if ( result.numOfArrow == 0 ){
			//Try to match with location keywords dictionary
			console.log("no keyword indicators found");
		}
		else if (result.numOfArrow > 0) {
			result = primaryIndicatorResultGamma( message, result );
		}
	}
	return result;
}

/*
 * Helper Function
 */
function getMinElementIndex( array ){
    return array.indexOf(Math.min.apply( Math, array ));
}

/*
 * Helper Function
 */
function cleanUpMessage( message ){
	//String to lower case
	message = message.toLowerCase();
	//Clean puntuation
	message = message.replace(/(\r\n|\n|\r)/gm," ");
	message = message.replace(/(\:|\;|\#|\.|\,|\!)/gm,"");
	message = message.replace(/\s+/g," ");
	//String split spaces
	message = message.split(" ");
	return message;
}

/*
 * Primary indicators include 'from', 'to', and '>'
 */
function findPrimaryIndicators( message ){

	var result = new findPrimaryIndicatorsResult();
	message.forEach( function( element, index ){
		if (element == 'from'){
			result.numOfFrom++;
			result.indexOfFrom.push(index);
		}
		else if (element == 'to'){
			//What if they are saying from DateTime to DateTime?
			result.numOfTo++;
			result.indexOfTo.push(index);
		}
		else if (element.indexOf(">") > -1){
			result.numOfArrow++;
			result.indexOfArrow.push(index);
		}
	});
	return result;
}

/*
 * Primary indicators find result model
 */
function findPrimaryIndicatorsResult(){
	this.numOfFrom = 0;
	this.indexOfFrom = [];
	this.numOfTo = 0;
	this.indexOfTo = [];
	this.numOfArrow = 0;
	this.indexOfArrow = [];
	this.origin = null;
	this.destination = null;
}

/*
 * Alpha Case
 */
function primaryIndicatorResultAlpha( message, result ){

	//Case 1
	if ( result.numOfFrom == 1 && result.numOfTo == 1 ){
		result = primaryIndicatorResultAlpha_Case1( message, result );
	}
	//Case 2: ignore the ones that are far away from 'to'
	else if ( result.numOfFrom > 1 && result.numOfTo == 1){
		var distanceBetweenFromAndTo = [];
		for( var i = 0; i < result.indexOfFrom.length; i++ ){
			distanceBetweenFromAndTo[i] = Math.abs(result.indexOfTo[0] - result.indexOfFrom[i]); 
		}
		//Set the 'from' that's most nearby 'to' to index location 0
		result.indexOfFrom[0] = result.indexOfFrom[getMinElementIndex(distanceBetweenFromAndTo)];
		result = primaryIndicatorResultAlpha_Case1( message, result );
	}
	//Case 3: ignore the ones that are far away from 'from'
	else if ( result.numOfFrom == 1 && result.numOfTo > 1 ){
		var distanceBetweenFromAndTo = [];
		for( var i = 0; i < result.indexOfTo.length; i++ ){
			distanceBetweenFromAndTo[i] = Math.abs(result.indexOfFrom[0] - result.indexOfTo[i]); 
		}
		//Set the 'from' that's most nearby 'to' to index location 0
		result.indexOfTo[0] = result.indexOfTo[getMinElementIndex(distanceBetweenFromAndTo)];
		result = primaryIndicatorResultAlpha_Case1( message, result );
	}
	else if ( result.numOfFrom > 1 && result.numOfTo > 1){
	//Case 4: where you might have multiple origin and destination
	console.log("Multiple 'from' and 'to' appeared in the context");
	}
	return result;
}

function primaryIndicatorResultAlpha_Case1( message, result ){

	var pointerStart;
	var pointerEnd;
	var fromisBeforeTo;

	if ( result.indexOfTo[0] > result.indexOfFrom[0]){
		pointerStart = result.indexOfFrom[0] + 1;
		pointerEnd = result.indexOfTo[0];
		fromisBeforeTo =  true;
	}
	else if ( result.indexOfTo[0] < result.indexOfFrom[0]) {
		pointerStart = result.indexOfTo[0] + 1;
		pointerEnd = result.indexOfFrom[0];
		fromisBeforeTo = false;
	}
	else{
		return result;
	}

	var firstLocation;
	var secondLocation;

	switch( pointerEnd - pointerStart ) {
		case 0:
			return result;
		case 1:
			firstLocation = message[pointerStart];
			secondLocation = message[pointerEnd + 1];
			break;
		case 2:
			firstLocation = message[pointerStart].concat(" ", message[pointerStart + 1]);
			secondLocation = message[pointerEnd + 1];
			break;
		case 3:
			if ( message[pointerStart+1].indexOf('(') > -1 || message[pointerStart+2].indexOf('(') > -1 ){
				firstLocation = message[pointerStart].concat(" ", message[pointerStart+1], " ", message[pointerStart+2]);
			}
			else {
				firstLocation = message[pointerStart];
			}
			secondLocation = message[pointerEnd + 1];
			break;
		default:
			if ( message[pointerStart+1].indexOf('(') > -1 && message[pointerStart+2].indexOf(')') > -1 ){
				firstLocation = message[pointerStart].concat(" ", message[pointerStart+1], " ", message[pointerStart+2]);
			}
			else if ( message[pointerStart+1].indexOf('(') > -1 && !message[pointerStart+2].indexOf(')') > -1 ){
				firstLocation = message[pointerStart].concat(" ", message[pointerStart+1]);
			}
			else{
				firstLocation = message[pointerStart];
			}
			secondLocation = message[pointerEnd + 1];
			break;
	}

	if (fromisBeforeTo){
		result.origin = firstLocation;
		result.destination = secondLocation;
	}
	else {
		result.destination = firstLocation;
		result.origin = secondLocation;
	}
	return result;
}


/*
 * Beta Case
 */
function primaryIndicatorResultBeta( message, result ){

	//Case 1
	if ( result.numOfTo == 1 ){
		result = primaryIndicatorResultBeta_Case1( message, result);
	}
	//Case 2: where you might have multiple origin and destination
	else if ( result.numOfTo > 1){
		console.log("Multiple 'to' appeared in the context")
	}
	return result;
}

function primaryIndicatorResultBeta_Case1( message, result){

	var pointer = result.indexOfTo[0];
	//If the string before 'to' contains keywords in dictionary, put origin to UW
	var dictionary = [ "drive", "driving", "leave", "leaving" ];
	var isOriginInContext = true;
	for (var i = 0; i < dictionary.length; i++){
		if ( message[pointer-1].indexOf(dictionary[i]) > -1 ) {
			isOriginInContext = false;
		}
	}
	if ( isOriginInContext  ){
		if ( message[pointer-1].indexOf(')') > -1 ){
			result.origin = message[pointer-2].concat(" ", message[pointer-1]);
		}
		else {
			result.origin = message[pointer-1];
		}

		if ( message[pointer+2].indexOf('(') > -1 ) {
			result.destination = message[pointer+1].concat(" ", message[pointer+2]);
		}
		else{
			result.destination = message[pointer+1];
		}
	}
	else{
		result.origin = "UWaterloo";
		result.destination = message[pointer+1];
	}
	return result;
}


/*
 * Gamma Case
 */
function primaryIndicatorResultGamma( message, result ){

	//Case 1
	if ( result.numOfArrow == 1 ){
		result = primaryIndicatorResultGamma_Case1( message, result );
	}
	//Case 2 where you might have multiple origin and destination
	else if ( rsult.numOfArrow > 1 ){
		console.log("Multiple '>' appeared in the context")
	}
	return result;
}

function primaryIndicatorResultGamma_Case1( message, result ) {

	var pointer = result.indexOfArrow[0];
	if ( message[pointer-1].indexOf(')') > -1 ){
		result.origin = message[pointer-2].concat(" ", message[pointer-1]);
	}
	else {
		result.origin = message[pointer-1];
	}

	if ( message[pointer+2].indexOf('(') > -1 ) {
		result.destination = message[pointer+1].concat(" ", message[pointer+2]);
	}
	else{
		result.destination = message[pointer+1];
	}
	return result;

}
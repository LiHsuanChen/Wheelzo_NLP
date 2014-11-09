/*
 * Starting from here
 */
exports.searchPrice = function( message ){

	//Do some cleanup
	message = cleanUpMessage_price(message);
	//Searching for primary indicators
	var result = findPrimaryIndicators_price(message);
	//Case Alpha
	if (result.numOfDollarSign == 1){
		result = primaryIndicatorResultAlpha_price(message, result);
	}
	//Case Beta
	else if ( result.numOfDollarSign > 1){
		//console.log("More than one $ found in the context");
	}
	//Case Delta
	else if ( result.numOfDollarSign == 0){
		//console.log("No $ found in the context");
		return result;
	}
	return result;
}

/*
 * Helper Function
 */
function cleanUpMessage_price( message ){
	//String to lower case
	message = message.toLowerCase();
	//Clean puntuation
	message = message.replace(/(\r\n|\n|\r)/gm," ");
	message = message.replace(/(\(|\)|\:|\;|\#|\.|\/|\,|\!)/gm," ");
	message = message.replace(/\s+/g," ");
	//String split spaces
	message = message.split(" ");
	return message;
}

/*
 * Primary indicators include '$'
 */
function findPrimaryIndicators_price( message ){

	var result = new findPrimaryIndicatorsResult_price();
	message.forEach( function( element, index ){
		if (element.indexOf("$") > -1){
			result.numOfDollarSign++;
			result.indexOfDollarSign.push(index);
		}
	});
	return result;
}

/*
 * Primary indicators find result model
 */
function findPrimaryIndicatorsResult_price(){
	this.numOfDollarSign = 0;
	this.indexOfDollarSign = [];
	this.price = null;
}

/*
 * Alpha Case
 */
function primaryIndicatorResultAlpha_price( message, result ){

	var targetString = message[result.indexOfDollarSign[0]];
	var dollarSignPosition = targetString.indexOf('$');
	var dollarSignLeft = targetString.substring(0, dollarSignPosition);
	var dollarSignRight = targetString.substring(dollarSignPosition+1, targetString.length);

	dollarSignLeft = parseInt(dollarSignLeft.replace(/\D/g,''));
	dollarSignRight = parseInt(dollarSignRight);

	if( dollarSignRight > 0 && dollarSignLeft > 0){
		result.price = dollarSignRight + " ? " + dollarSignLeft;
	}
	else if ( dollarSignRight > 0 ){
		result.price = dollarSignRight;
	}
	else if ( dollarSignLeft > 0){
		result.price = dollarSignLeft;
	}
	return result;
}
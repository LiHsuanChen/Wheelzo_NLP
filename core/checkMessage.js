exports.isDriver = function( message ) {
    var words = isDriver_cleanText(message).split(" ");
    
    var passengerHintWords = [
        "looking",
        "need"
    ];
    
    for (var i=0; i<passengerHintWords.length; i++) {
        if ( words.containsValue(passengerHintWords[i]) ) {
            return false;
        } 
    };

    var driverHintWords = [
        "driving",
        "leaving",
        "available",
        "seats"
    ];
    for (var i=0; i<driverHintWords.length; i++) {
        if ( words.containsValue(driverHintWords[i]) ) {
            return true;
        }
    };
    
    // we are now unsure...
    return true;
}

function isDriver_cleanText( message ) {
    console.log(message);
    message = message.replace(/(\r\n|\n|\r)/gm," ");
    message = message.replace(/(\(|\)|\:|\;|\#|\.|\/|\,|\!|\-)/gm," ");
    message = message.replace(/\s+/g," ");
    message = message.toLowerCase();
    return message;
}
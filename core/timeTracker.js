exports.extractDeparture = function( message, postTime ) {
    message = extractDeparture_cleanText(message);
    var userDescription;
    
    /* Setting the date of departure */
    // dealing with the straightforward cases first
    if ( !userDescription ) {
        if ( message.containsExpression("today") || message.containsExpression("tonight") ) {
            userDescription = "now";
        } else if ( message.containsExpression("tomorrow") ) {
            userDescription = "+1 day";
        }
    }
    
    if ( !userDescription ) {
        var dateHintExpressions = [
            "next monday",
            "next tuesday",
            "next wednesday",
            "next thursday",
            "next friday",
            "next saturday",
            "next sunday"
        ];
        for (var i=0; i<dateHintExpressions.length; i++) {
            if ( message.containsExpression(dateHintExpressions[i]) ) {
                userDescription = dateHintExpressions[i];
            }
        }
    };

    if ( !userDescription ) {
        userDescription = "now";
    }
    /* End of setting the date of departure */

    /* Setting the time of departure */
    var hour = 12;
    var minute = 0;
    var second = 0;
    if ( message.containsExpression("morning") ) {
        hour = 10;
    } else if ( message.containsExpression("noon") ) {
        if ( message.containsExpression("afternoon") ) {
            hour = 15;
        } else {
            hour = 12;
        }
    } else if ( message.containsExpression("tonight") || message.containsExpression("evening") ) {
        hour = 20;
    } else if ( message.containsExpression("am") || message.containsExpression("pm") ) {
        var timestampIdentifier = 0;
        var words = message.split(" ");
        if ( message.containsExpression("am") ) {
            hour = 0;
            timestampIdentifier = words.indexOf("am");

            while ( !is_numeric(words[timestampIdentifier-1]) ) {
                timestampIdentifier = words.indexOf("am", timestampIdentifier+1);
                if(timestampIdentifier == -1) break;
            }
        } else {
            timestampIdentifier = words.indexOf("pm");

            while ( !is_numeric(words[timestampIdentifier-1]) ) {
                timestampIdentifier = words.indexOf("pm", timestampIdentifier+1);
                if(timestampIdentifier == -1) break;
            }
        }
        
        var hourLocation = timestampIdentifier;

        while ( is_numeric(words[hourLocation-1]) ) {
            hourLocation = hourLocation - 1;
        }


        if ( hourLocation >= 0) {
          hour = hour + parseInt(words[hourLocation]);
        }
        else {
          hour = 0;
        }

        if ( words[hourLocation+1] ) {
            if ( is_numeric(words[hourLocation+1]) ) {
                minute = minute + parseInt( words[hourLocation+1] );
            }
        }
    } else {
        // cannot find anything, use preset defaults
    }
    /* End of setting the date of departure */

    // Building out the date object to return
    var postTime_unix = new Date(postTime).getTime() / 1000;



    var departure = new Date( strtotime(userDescription, postTime_unix)*1000 );

    departure.setHours( hour, minute, second );

    return departure.toISOString();
}

function extractDeparture_cleanText( message ) {

  message = message.replace(/(\r\n|\n|\r)/gm," ");
  message = message.replace(/(\(|\)|\:|\;|\#|\/|\.|\,|\!|\-|\~)/gm," ");
  message = message.toLowerCase();
  
  message = message.replace(/ mon /g      ,   ' monday '   );
  message = message.replace(/ tue /g      ,   ' tuesday '  );
  message = message.replace(/ tues /g     ,   ' tuesday '  );
  message = message.replace(/ wed /g      ,   ' wednesday ');
  message = message.replace(/ thur /g     ,   ' thursday ' );
  message = message.replace(/ thurs /g    ,   ' thursday ' );
  message = message.replace(/ fri /g      ,   ' friday '   );
  message = message.replace(/ sat /g      ,   ' saturday ' );
  message = message.replace(/ sun /g      ,   ' sunday '   );

  message = message.replace(/monday/g     ,   'next monday'   );
  message = message.replace(/tuesday/g    ,   'next tuesday'  );
  message = message.replace(/wednesday/g  ,   'next wednesday');
  message = message.replace(/thursday/g   ,   'next thursday' );
  message = message.replace(/friday/g     ,   'next friday'   );
  message = message.replace(/saturday/g   ,   'next saturday' );
  message = message.replace(/sunday/g     ,   'next sunday'   );

  message = message.replace(/am/g         ,   ' am');
  message = message.replace(/pm/g         ,   ' pm');

  message = message.replace(/\s+/g," ");
  return message;                
}

String.prototype.containsExpression = function(expression) {
    var regex = new RegExp('\\b' + expression + '\\b');
    return regex.test(this);
};


function is_numeric(str){
    return /^\d+$/.test(str);
}

function strtotime(text, now) {
  //  discuss at: http://phpjs.org/functions/strtotime/
  //     version: 1109.2016
  // original by: Caio Ariede (http://caioariede.com)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Caio Ariede (http://caioariede.com)
  // improved by: A. Matías Quezada (http://amatiasq.com)
  // improved by: preuter
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Mirko Faber
  //    input by: David
  // bugfixed by: Wagner B. Soares
  // bugfixed by: Artur Tchernychev
  //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
  //   example 1: strtotime('+1 day', 1129633200);
  //   returns 1: 1129719600
  //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
  //   returns 2: 1130425202
  //   example 3: strtotime('last month', 1129633200);
  //   returns 3: 1127041200
  //   example 4: strtotime('2009-05-04 08:30:00 GMT');
  //   returns 4: 1241425800

  var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

  if (!text) {
    return fail;
  }

  // Unecessary spaces
  text = text.replace(/^\s+|\s+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\t\r\n]/g, '')
    .toLowerCase();

  // in contrast to php, js Date.parse function interprets:
  // dates given as yyyy-mm-dd as in timezone: UTC,
  // dates with "." or "-" as MDY instead of DMY
  // dates with two-digit years differently
  // etc...etc...
  // ...therefore we manually parse lots of common date formats
  match = text.match(
    /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

  if (match && match[2] === match[4]) {
    if (match[1] > 1901) {
      switch (match[2]) {
      case '-':
        {
          // YYYY-M-D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case '.':
        {
          // YYYY.M.D is not parsed by strtotime()
          return fail;
        }
      case '/':
        {
          // YYYY/M/D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      }
    } else if (match[5] > 1901) {
      switch (match[2]) {
      case '-':
        {
          // D-M-YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case '.':
        {
          // D.M.YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case '/':
        {
          // M/D/YYYY
          if (match[1] > 12 || match[3] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      }
    } else {
      switch (match[2]) {
      case '-':
        {
          // YY-M-D
          if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
            return fail;
          }

          year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
          return new Date(year, parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case '.':
        {
          // D.M.YY or H.MM.SS
          if (match[5] >= 70) {
            // D.M.YY
            if (match[3] > 12 || match[1] > 31) {
              return fail;
            }

            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
          if (match[5] < 60 && !match[6]) {
            // H.MM.SS
            if (match[1] > 23 || match[3] > 59) {
              return fail;
            }

            today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
              match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
          }

          // invalid format, cannot be parsed
          return fail;
        }
      case '/':
        {
          // M/D/YY
          if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
            return fail;
          }

          year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
          return new Date(year, parseInt(match[1], 10) - 1, match[3],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      case ':':
        {
          // HH:MM:SS
          if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
            return fail;
          }

          today = new Date();
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
            match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
        }
      }
    }
  }

  // other formats and "now" should be parsed by Date.parse()
  if (text === 'now') {
    return now === null || isNaN(now) ? new Date()
      .getTime() / 1000 | 0 : now | 0;
  }
  if (!isNaN(parsed = Date.parse(text))) {
    return parsed / 1000 | 0;
  }

  date = now ? new Date(now * 1000) : new Date();
  days = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6
  };
  ranges = {
    'yea': 'FullYear',
    'mon': 'Month',
    'day': 'Date',
    'hou': 'Hours',
    'min': 'Minutes',
    'sec': 'Seconds'
  };

  function lastNext(type, range, modifier) {
    var diff, day = days[range];

    if (typeof day !== 'undefined') {
      diff = day - date.getDay();

      if (diff === 0) {
        diff = 7 * modifier;
      } else if (diff > 0 && type === 'last') {
        diff -= 7;
      } else if (diff < 0 && type === 'next') {
        diff += 7;
      }

      date.setDate(date.getDate() + diff);
    }
  }

  function process(val) {
    var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
      type = splt[0],
      range = splt[1].substring(0, 3),
      typeIsNumber = /\d+/.test(type),
      ago = splt[2] === 'ago',
      num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

    if (typeIsNumber) {
      num *= parseInt(type, 10);
    }

    if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
      return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
    }

    if (range === 'wee') {
      return date.setDate(date.getDate() + (num * 7));
    }

    if (type === 'next' || type === 'last') {
      lastNext(type, range, num);
    } else if (!typeIsNumber) {
      return false;
    }

    return true;
  }

  times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
    '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
    '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
  regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

  match = text.match(new RegExp(regex, 'gi'));
  if (!match) {
    return fail;
  }

  for (i = 0, len = match.length; i < len; i++) {
    if (!process(match[i])) {
      return fail;
    }
  }

  // ECMAScript 5 only
  // if (!match.every(process))
  //    return false;

  return (date.getTime() / 1000);
}
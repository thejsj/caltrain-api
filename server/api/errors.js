/**
 * Parameter Value Error
 *
 * Error with the value passed as a query parameter
 */

var extendError = function (property) {
  return function (ParentError) {
    return function (propertyValue) {
      var value = new ParentError()[property];
      return `${value}: ${propertyValue}`;
    };
  };
};

var _name = extendError('name');
var _message = extendError('message');

var ParameterValueError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The supplied parameters are incorrect';
};
ParameterValueError.prototype = Object.create(Error.prototype);
ParameterValueError.constructor = ParameterValueError;

var name = _name(ParameterValueError);
var message = _message(ParameterValueError);

var UnixTimestampFormattingError = function () {
  this.name = name('Unix Timestamp Formatting Error');
  let m= `UNIX Timestamp provided for departure is before the year 2000. `;
  m += `Are you sure you didn't forget the milliseconds (JavaScript UNIX Timestamps)?`;
  this.message = message(m);
};
UnixTimestampFormattingError.prototype = Object.create(ParameterValueError.prototype);
UnixTimestampFormattingError.constructor = UnixTimestampFormattingError;

var FieldsParameterValueError = function () {
  this.name = name('Fields Parameter Value Error');
  this.message = message('No fields returned for queried objects. '+
    'Check your `fields` parameter in query');
};
FieldsParameterValueError.prototype = Object.create(ParameterValueError.prototype);
FieldsParameterValueError.constructor = FieldsParameterValueError;

var DepartureArrivalParameterValueError = function (message) {
  this.name = name('Departure/Arrival Error');
  let m = 'Incorrect Parameters: Arrival time and departure time are not on the same date';
  m += ' or Arrival time occurs before departure time';
  this.messgae = message(message || m);
};
DepartureArrivalParameterValueError.prototype = Object.create(ParameterValueError.prototype);
DepartureArrivalParameterValueError.constructor = DepartureArrivalParameterValueError;

var DepartureQueryDayParameterValueError = function () {
  this.name = name('Departure/Query Day Error');
  this.message = message('Incorrect Parameters: Departure time and query day are not on the same date');
};
DepartureQueryDayParameterValueError.prototype = Object.create(ParameterValueError.prototype);
DepartureQueryDayParameterValueError.constructor = DepartureQueryDayParameterValueError;

var ArrivalQueryDayParameterValueError = function () {
  this.name = name('Arrival/Query Day Error');
  this.message = message('Incorrect Parameters: Arrival time and query day are not on the same date');
};
ArrivalQueryDayParameterValueError.prototype = Object.create(ParameterValueError.prototype);
ArrivalQueryDayParameterValueError.constructor = ArrivalQueryDayParameterValueError;

var LatitudeParameterValueError = function () {
  this.name = name('Latitude Parameter Error');
  this.message = message('Latitude parameter is not a valid latitude');
};
LatitudeParameterValueError.prototype = Object.create(ParameterValueError.prototype);
LatitudeParameterValueError.constructor = LatitudeParameterValueError;

var LongitudeParameterValueError = function () {
  this.name = name('Longitude Parameter Error');
  this.message = message('Longitude parameter is not a valid longitude');
};
LongitudeParameterValueError.prototype = Object.create(ParameterValueError.prototype);
LongitudeParameterValueError.constructor = LongitudeParameterValueError;

var TrainTypeFilterParameterError = function () {
  this.name = name('Parameter Valuer Error');
  this.message = message('Only three types allowed for type filter');
};
TrainTypeFilterParameterError.prototype = Object.create(ParameterValueError.prototype);
TrainTypeFilterParameterError.constructor = TrainTypeFilterParameterError;

/**
 * Not Enough Parameters
 *
 * Not enough query parameters specified to complete the query succsefully
 */

var NotEnoughParametersError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'Not enough parameters specified';
};
NotEnoughParametersError.prototype = Object.create(Error.prototype);
NotEnoughParametersError.constructor = NotEnoughParametersError;

var name = _name(NotEnoughParametersError);
var message = _message(NotEnoughParametersError);

var ArrivalToNotEnoughParametersError = function () {
  this.name = name('`To` Parameter Not Specified Error');
  this.message = message('Not enough parameters supplied. `arrival` specified without a `to` station.');
};
ArrivalToNotEnoughParametersError.prototype = Object.create(NotEnoughParametersError.prototype);
ArrivalToNotEnoughParametersError.constructor = ArrivalToNotEnoughParametersError;

var DepartureFromNotEnoughParametersError = function () {
  this.name = name('`From` Parameter Not Specified');
  this.message = message('Not enough parameters supplied. `departure` specified without a `from` station.');
};
DepartureFromNotEnoughParametersError.prototype = Object.create(NotEnoughParametersError.prototype);
DepartureFromNotEnoughParametersError.constructor = DepartureFromNotEnoughParametersError;

/**
 * Query Error
 *
 * query has been executed by the data, but returned an error
 */

var QueryError = function () {
  this.name = 'Query Error';
  this.message = 'The requested resources do not exist. Try changing your query.';
};
QueryError.prototype = Object.create(Error.prototype);
QueryError.constructor = QueryError;

exports.ParameterValueError = ParameterValueError;
exports.UnixTimestampFormattingError = UnixTimestampFormattingError;
exports.FieldsParameterValueError = FieldsParameterValueError;
exports.DepartureQueryDayParameterValueError = DepartureQueryDayParameterValueError;
exports.DepartureArrivalParameterValueError = DepartureArrivalParameterValueError;
exports.ArrivalQueryDayParameterValueError = ArrivalQueryDayParameterValueError;
exports.LatitudeParameterValueError = LatitudeParameterValueError;
exports.LongitudeParameterValueError = LongitudeParameterValueError;
exports.TrainTypeFilterParameterError = TrainTypeFilterParameterError;

exports.NotEnoughParametersError = NotEnoughParametersError;
exports.ArrivalToNotEnoughParametersError = ArrivalToNotEnoughParametersError;
exports.DepartureFromNotEnoughParametersError = DepartureFromNotEnoughParametersError;

exports.QueryError = QueryError;

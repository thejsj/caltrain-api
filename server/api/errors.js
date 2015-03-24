
/**
 * Parameter Value Error
 *
 * Error with the value passed as a query parameter
 */

var ParameterValuerError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
ParameterValueError.prototype = Object.create(Error);
ParameterValueError.constructor = ParameterValueError;

var UnixTimestampFormattingError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
UnixTimestampFormattingError.prototype = Object.create(ParameterValueError);
UnixTimestampFormattingError.constructor = UnixTimestampFormattingError;

var FieldsParameterValueError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
FieldsParameterValueError.prototype = Object.create(ParameterValueError);
FieldsParameterValueError.constructor = FieldsParameterValueError;

var DepartureQueryDayParameterValueError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
DepartureQueryDayParameterValueError.prototype = Object.create(ParameterValueError);
DepartureQueryDayParameterValueError.constructor = DepartureQueryDayParameterValueError;

var ArrivalQueryDayParameterValueError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
ArrivalQueryDayParameterValueError.prototype = Object.create(ParameterValueError);
ArrivalQueryDayParameterValueError.constructor = ArrivalQueryDayParameterValueError;

var LatitudeParameterValueError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
LatitudeParameterValueError.prototype = Object.create(ParameterValueError);
LatitudeParameterValueError.constructor = LatitudeParameterValueError;

var LongitudeParameterValueError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
LongitudeParameterValueError.prototype = Object.create(ParameterValueError);
LongitudeParameterValueError.constructor = LongitudeParameterValueError;

/**
 * Not Enough Parameters
 *
 * Not enough query parameters specified to complete the query succsefully
 */

var NotEnoughParametersError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
NotEnoughParametersError.prototype = Object.create(Error);
NotEnoughParametersError.constructor = NotEnoughParametersError;

var ArrivalToNotEnoughParametersError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
ArrivalToNotEnoughParametersError.prototype = Object.create(NotEnoughParametersError);
ArrivalToNotEnoughParametersError.constructor = ArrivalToNotEnoughParametersError;

var DepartureFromNotEnoughParametersError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
DepartureFromNotEnoughParametersError.prototype = Object.create(NotEnoughParametersError);
DepartureFromNotEnoughParametersError.constructor = DepartureFromNotEnoughParametersError;

/**
 * Query Error
 *
 * query has been executed by the data, but returned an error
 */

var QueryError = function () {
  this.name = 'Parameter Valuer Error';
  this.message = 'The parameters you have supplied are incorrect';
};
QueryError.prototype = Object.create(Error);
QueryError.constructor = QueryError;

exports.ParameterValuerError = ParameterValuerError;
exports.UnixTimestampFormattingError = UnixTimestampFormattingError;
exports.FieldsParameterValueError = FieldsParameterValueError;
exports.DepartureQueryDayParameterValueError = DepartureQueryDayParameterValueError;
exports.ArrivalQueryDayParameterValueError = ArrivalQueryDayParameterValueError;
exports.LatitudeParameterValueError = LatitudeParameterValueError;
exports.LongitudeParameterValueError = LongitudeParameterValueError;

exports.NotEnoughParametersError = NotEnoughParametersError;
exports.ArrivalToNotEnoughParametersError = ArrivalToNotEnoughParametersError;
exports.DepartureFromNotEnoughParametersError = DepartureFromNotEnoughParametersError;

exports.QueryError = QueryError;

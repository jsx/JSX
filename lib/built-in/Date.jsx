// 15.9
native final class Date {
	// NOTE: those "number"s may be NaN, so it canot be integers.

	// TODO: complete all the methods

	// 15.9.3
	function initialize(year :number, month :number);
	function initialize(year :number, month :number, date :number);
	function initialize(year :number, month :number, date :number,
						hours :number);
	function initialize(year :number, month :number, date :number,
						hours :number, minutes :number);
	function initialize(year :number, month :number, date :number,
						hours :number, minutes :number, seconds :number);
	function initialize(year :number, month :number, date :number,
						hours :number, minutes :number, seconds :number,
						ms :number);

	function initialize(value :String);
	function initialize(value :number);
	// not defined in ECMA-262, but JS's new Date(new Date) works
	function initialize(value :Date);

	function initialize();

	// 15.9.4
	static function parse(value :Date) :Date;

	//static function UTC(year, month [, dat [, hours [, minutes [, seconds [, ms ]]]]]);

	static function now() :number;

	// 15.9.5
	function toString() :String;
	function toDateString() :String;
	function toTimeString() :String;
	function toLocaleStrng() :String;
	function toLocaleDateStrng() :String;
	function toLocaleTimeStrng() :String;
	function valueOf() :number;

	function getTime() :number;
	function getFullYear() :number;
	function getUTCFullYear() :number;
	function getMonth() :number;
	function getUTCMonth() :number;
	function getDate() :number;
	function getUTCDate() :number;
	function getHours() :number;
	function getUTCHours() :number;
	function getMinutes() :number;
	function getUTCMinutes() :number;
	function getSeconds() :number;
	function getUTCSeconds() :number;
	function getMilliseconds() :number;
	function getUTCMilliseconds() :number;
	function getTimezoneOffset() :number;

	// 15.9.3.28-
	function setTime(time :number) :number;
	function setMilliseconds(ms :number) :number;
	function setUTCMilliseconds(ms :number) :number;
	function setSeconds(sec :number) :number;
	function setUTCSeconds(sec :number) :number;
	function setMinutes(min :number) :number;
	function setUTCMinutes(min :number) :number;
	function setHours(hour :number) :number;
	function setUTCHours(hour :number) :number;
	function setDate(date :number) :number;
	function setUTCDate(date :number) :number;
	function setMonth(month :number) :number;
	function setUTCMonth(month :number) :number;
	function setFullYear(year :number) :number;
	function setUTCFullYear(year :number) :number;

	// 15.9.5.42-
	function toUTCString() :String;
	function toISOString() :String;
	function toJSON() :String;
	function toJSON(key :String) :String; // key is given but ignored
}

// vim: set noexpandtab:

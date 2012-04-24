// ECMA 262 3rd
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

	function initialize(value :string);
	function initialize(value :number);
	// not defined in ECMA-262, but JS's new Date(new Date) works
	function initialize(value :Date);

	function initialize();

	// 15.9.4
	static function parse(value :string) :number;

	static function UTC(year :number, month :number) :Date;
	static function UTC(year :number, month :number, date :number) :Date;
	static function UTC(year :number, month :number, date :number,
						hours :number) :Date;
	static function UTC(year :number, month :number, date :number,
						hours :number,  minutes :number) :Date;
	static function UTC(year :number, month :number, date :number,
						hours :number,  minutes :number, seconds: number)
						:Date;
	static function UTC(year :number, month :number, date :number,
						hours :number,  minutes :number, seconds: number,
						ms :number) :Date;


	static function now() :number;

	// 15.9.5
	// NOTE: to*String is implementation-dependent
	function toString() :string;
	function toDateString() :string;
	function toTimeString() :string;
	function toLocaleString() :string;
	function toLocaleDateString() :string;
	function toLocaleTimeString() :string;

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

	// 15.9.5.42- added in ECMA-262 5th
	function toUTCString() :string;
	function toISOString() :string;
	function toJSON() :string;
	function toJSON(key :string) :string; // key is given but ignored
}

// vim: set noexpandtab:

native class Object {

	function toString() : string;

}

// 15.2
native final class Map.<T> {

	function __native_index_operator__(key : string) : MayBeUndefined.<T>;

	// 15.2.4
	function hasOwnProperty(key : string) : boolean;

}

// 15.3
native final class Function {
	// JSX does not support call() or apply(), since it is a statically-typed language
}

// 15.4
native final class Array.<T> {

	function __native_index_operator__(n : number) : MayBeUndefined.<T>;

	// 15.4.4
	override function toString() : string;
	function toLocaleString() : string;
	function concat(a : Array.<T>) : Array.<T>; // FIXME more arguments
	function join() : string;
	function join(separator : string) : string;
	function pop() : MayBeUndefined.<T>;
	function push(item : T) : int; // FIXME more arguments
	function reverse() : Array.<T>;
	function shift() : MayBeUndefined.<T>;
	function slice(start : int) : Array.<T>;
	function slice(start : int, end : int) : Array.<T>;
	function sort() : Array.<T>;
	function sort(comparefn : function (x : MayBeUndefined.<T>, y : MayBeUndefined.<T>) : int) : Array.<T>;
	function sort(comparefn : function (x : MayBeUndefined.<T>, y : MayBeUndefined.<T>) : number) : Array.<T>;
	function splice(start : int, deleteCount : int) : Array.<T>; // FIXME more arguments
	function unshift(item : T) : int; // FIXME more arguments

	// 15.4.5
	var length : int;
}

// 15.5
native final class String {

	// 15.5.2
	function constructor();
	function constructor(s : string);
	function constructor(s : String);

	// 15.5.3
	static function fromCharCode(char0 : int) : string; // FIXME support vararg

	// 15.5.4
	override function toString() : string;
	function valueOf() : string;
	function charAt(pos : int) : string;
	function charCodeAt(pos : int) : int;
	function concat(string1 : String) : string; // FIXME support vararg
	function indexOf(searchString : string) : int;
	function indexOf(searchString : string, position : int) : int;
	function lastIndexOf(searchString : string) : int;
	function lastIndexOf(searchString : string, position : int) : int;
	// FIXME localeCompare?
	function match(regexp : RegExp) : string [];
	function replace(searchValue : string, replaceValue : string) : string;
	function replace(searchValue : RegExp, replaceValue : string) : string;
	// FIXME 15.5.4.11
	function replace(searchValue : string, replaceValue : function(matched :string):string) : string;
	function replace(searchValue : RegExp, replaceValue : function(matched :string):string) : string;
	function search(searchValue : string) : int;
	function search(searchValue : RegExp) : int;
	function slice(start : int) : string;
	function slice(start : int, end : int) : string;
	function split(separator : string) : string [];
	function split(separator : string, limit : int) : string [];
	function split(separator : RegExp) : string [];
	function split(separator : RegExp, limit : int) : string [];
	function substring(start : int) : string;
	function substring(start : int, end : int) : string;
	function toLowerCase() : string;
	function toLocaleLowerCase() : string;
	function toUpperCase() : string;
	function toLocaleUpperCase() : string;

	function trim() : string;

	// 15.5.5
	var length : int;

	// removed: use substring() instead
	// function substr(start : int) : string;
	// function substr(start : int, length : int) : string;
}

// 15.6
native final class Boolean {

	// 15.6.2
	function constructor();
	function constructor(value : boolean);
	function constructor(value : Boolean);

	// 15.6.4
	override function toString() : string;
	function valueOf() : boolean;
}


// 15.7
native final class Number {

	// 15.7.2
	function constructor();
	function constructor(value : number);
	function constructor(value : Number);

	// 15.7.3
	static var MAX_VALUE : number;
	static var MIN_VALUE : number;

	// NOTE: NaN, POSITIVE_INFINITY and NEGATIVE_INFINITY are
	//       not provided. Use NaN, +Infinity, and -Infinity literals
	//       instead.

	// 15.7.4
	override function toString() : string;
	function toString(radix : int) : string;
	function toLocaleString() : string;
	function valueOf() : number;
	function toFixed(fractionDigits : int) : string;
	function toExpotential(fractionDigits : int) : string;
	function toPrecision(precision : int) : string;

	// 15.1.2 (Function Properties of the Global Object)
	static function parseInt(str :string) :number;
	static function parseInt(str :string, radix :int) :number;
	static function parseFloat(str :string) :number;
	static function isNaN(num :number) :boolean;
	static function isFinite(num :number) :boolean;

}

// 15.8
native final class Math {
	// 15.8.1
	static const E :number;
	static const LN10 :number;
	static const LN2 :number;
	static const LOG2E :number;
	static const LOG10E :number;
	static const PI :number;
	static const SQRT1_2 :number;
	static const SQRT2 :number;

	// 15.8.2
	static function abs(x :number) :number;
	static function acos(x :number) :number;
	static function asin(x :number) :number;
	static function atan(x :number) :number;
	static function atan2(y :number, x :number) :number;
	static function ceil(x :number) :number;
	static function cos(x :number) :number;
	static function exp(x :number) :number;
	static function floor(x :number) :number;
	// FIXME
	// static function log(x :number) :number;
	// FIXME: ECMA-262's max() and min() take zero or more arguments
	static function max(value1 :number, value2 :number) :number;
	static function min(value1 :number, value2 :number) :number;
	static function pow(x :number, y :number) :number;
	static function random() :number;
	static function round(x :number) :number;
	static function sin(x :number) :number;
	static function sqrt(x :number) :number;
	static function tan(x :number) :number;

}

// 15.9
native final class Date {
	// NOTE: these "number"s may be NaN, so it cannot be int.

	// TODO: complete all the methods

	// 15.9.3
	function constructor(year :number, month :number);
	function constructor(year :number, month :number, date :number);
	function constructor(year :number, month :number, date :number,
						hours :number);
	function constructor(year :number, month :number, date :number,
						hours :number, minutes :number);
	function constructor(year :number, month :number, date :number,
						hours :number, minutes :number, seconds :number);
	function constructor(year :number, month :number, date :number,
						hours :number, minutes :number, seconds :number,
						ms :number);

	function constructor(value :string);
	function constructor(value :number);
	// not defined in ECMA-262, but JS's new Date(new Date) works
	function constructor(value :Date);

	function constructor();

	// 15.9.4
	static function parse(value :string) :number;

	static function UTC(year :number, month :number) : number;
	static function UTC(year :number, month :number, date :number) : number;
	static function UTC(year :number, month :number, date :number,
						hours :number) : number;
	static function UTC(year :number, month :number, date :number,
						hours :number,  minutes :number) : number;
	static function UTC(year :number, month :number, date :number,
						hours :number,  minutes :number, seconds: number)
						: number;
	static function UTC(year :number, month :number, date :number,
						hours :number,  minutes :number, seconds: number,
						ms :number) : number;


	static function now() :number;

	// 15.9.5
	// NOTE: to*String is implementation-dependent
	override function toString() :string;
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

// 15.10 RegExp
native final class RegExp {

	function constructor(pattern :string, flags :string);
	function constructor(pattern :string);
	function constructor(pattern :RegExp);

	// FIXME: the matched object is a variation of string[],
	//        but has "index", "input" and "lastIndex" properties
	function exec(str :string) :string[];

	function test(str :string) :boolean;

	override function toString() :string;

	const source :string;
	const global :boolean;
	const ignoreCase :boolean;
	const multiline :boolean;
	const lastIndex :int;

}

// 15.11 Error
native class Error {

	function constructor();
	function constructor(message : string);

	var name : string;
	var message : string;

}

native class EvalError extends Error {
}

native class RangeError extends Error {
}

native class ReferenceError extends Error {
}

native class SyntaxError extends Error {
}

native class TypeError extends Error {
}

// 5.12

native class JSON {

	static function parse(text : string) : variant;
	static function parse(text : string, reviver : function(key:string, value:variant):variant) : variant;

	static function stringify(value : variant) : string;
	static function stringify(value : variant, replacer : function(key:string,value:variant):variant) : string;
	static function stringify(value : variant, replacer : function(key:string,value:variant):variant, space : int) : string;

}

// vim: set noexpandtab:

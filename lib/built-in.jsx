/*
 * Copyright (c) 2012 DeNA Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

native class Object {

	function toString() : string;

}

// 15.2
native final class Map.<T> {

	function __native_index_operator__(key : string) : Nullable.<T>;

	// 15.2.4
	function hasOwnProperty(key : string) : boolean;

}

// 15.3
native final class Function {
	// JSX does not support call() or apply(), since it is a statically-typed language
}

// 15.4
native final class Array.<T> {

	function constructor();
	function constructor(length : number);

	function __native_index_operator__(n : number) : Nullable.<T>;

	// 15.4.4
	override function toString() : string;
	function toLocaleString() : string;
	function concat(...a : Array.<T>) : Array.<T>;
	function join() : string;
	function join(separator : string) : string;
	function pop() : Nullable.<T>;
	function push(...item : T) : int;
	function reverse() : Array.<T>;
	function shift() : Nullable.<T>;
	function slice(start : int) : Array.<T>;
	function slice(start : int, end : int) : Array.<T>;
	function sort() : Array.<T>;
	function sort(comparefn : function (x : Nullable.<T>, y : Nullable.<T>) : int) : Array.<T>;
	function splice(start : int, deleteCount : int, ...item : T) : Array.<T>;
	function unshift(...item : T) : int;

	// 15.4.4 (ES5)
	function indexOf(value : Nullable.<T>) : number;
	function indexOf(value : Nullable.<T>, fromIndex : number) : number;
	function lastIndexOf(value : Nullable.<T>) : number;
	function lastIndexOf(value : Nullable.<T>, fromIndex : number) : number;
	function every(callbackfn : function(value : Nullable.<T>) : boolean) : boolean;
	function every(callbackfn : function(value : Nullable.<T>, index : number) : boolean) : boolean;
	function every(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : boolean) : boolean;
	function some(callbackfn : function(value : Nullable.<T>) : boolean) : boolean;
	function some(callbackfn : function(value : Nullable.<T>, index : number) : boolean) : boolean;
	function some(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : boolean) : boolean;
	inline function forEach(callbackfn : function(value : Nullable.<T>) : void) : void {
		for (var i in this) {
			callbackfn(this[i]);
		}
	}
	function forEach(callbackfn : function(value : Nullable.<T>, index : number) : void) : void;
	function forEach(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : void) : void;
	function map(callbackfn : function(value : Nullable.<T>) : Nullable.<T>) : Array.<T>;
	function map(callbackfn : function(value : Nullable.<T>, index : number) : Nullable.<T>) : Array.<T>;
	function map(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : Nullable.<T>) : Array.<T>;
	function filter(callbackfn : function(value : Nullable.<T>) : boolean) : Array.<T>;
	function filter(callbackfn : function(value : Nullable.<T>, index : number) : boolean) : Array.<T>;
	function filter(callbackfn : function(value : Nullable.<T>, index : number, array : Array.<T>) : boolean) : Array.<T>;

	function reduce(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>) : Array.<T>;
	function reduce(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>, initialValue : T) : Array.<T>;
	function reduceRight(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>) : Array.<T>;
	function reduceRight(callbackfn : function(previousValue : Nullable.<T>, currentValue : Nullable.<T>) : Nullable.<T>, initialValue : T) : Array.<T>;

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
	static function fromCharCode(...charN : int) : string;

	// 15.5.4
	override function toString() : string;
	function valueOf() : string;
	function charAt(pos : int) : string;
	function charCodeAt(pos : int) : number;
	function concat(...stringN : String) : string;
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
	__readonly__ var length : int;

	// removed: use substring() instead
	// function substr(start : int) : string;
	// function substr(start : int, length : int) : string;

	// 15.1.3 URI Handling Function Properties
	static function encodeURIComponent(str : string) : string;
	static function decodeURIComponent(str : string) : string;
	static function encodeURI(str : string) : string;
	static function decodeURI(str : string) : string;

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
	static const MAX_VALUE : number;
	static const MIN_VALUE : number;

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
	static const E = 2.718281828459045;
	static const LN10 = 2.302585092994046;
	static const LN2 = 0.6931471805599453;
	static const LOG2E = 1.4426950408889634;
	static const LOG10E = 0.4342944819032518;
	static const PI = 3.141592653589793;
	static const SQRT1_2 = 0.7071067811865476;
	static const SQRT2 = 1.4142135623730951;

	// 15.8.2
	static function abs(x :number) :number {
		return x >= 0 ? x : -x;
	}
	static function acos(x :number) :number;
	static function asin(x :number) :number;
	static function atan(x :number) :number;
	static function atan2(y :number, x :number) :number;
	static function ceil(x :number) :number;
	static function cos(x :number) :number;
	static function exp(x :number) :number;
	static function floor(x :number) :number;
	static function log(x :number) :number;
	static function max(value1 : number, value2 : number, value3 : number, ...valueN : number) : number;
	static function max(value1 : number) : number;
	static function min(value1 : number, value2 : number, value3 : number, ...valueN : number) : number;
	static function min(value1 : number) : number;
	static function pow(x :number, y :number) :number;
	static function random() :number;
	static function round(x :number) :number;
	static function sin(x :number) :number;
	static function sqrt(x :number) :number;
	static function tan(x :number) :number;

	// optimized (inlined) version for two-arg min/max
	static function max(value1 :number, value2 :number) :number {
		return value1 >= value2 ? value1 : value2;
	}
	static function min(value1 :number, value2 :number) :number {
		return value1 <= value2 ? value1 : value2;
	}
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
	function getDay() :number;
	function getUTCDay() :number;
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

	__readonly__ var source :string;
	__readonly__ var global :boolean;
	__readonly__ var ignoreCase :boolean;
	__readonly__ var multiline :boolean;
	__readonly__ var lastIndex :int;

}

// 15.11 Error
native class Error {

	function constructor();
	function constructor(message : string);

	var name : string;
	var message : string;

}

native class EvalError extends Error {
	function constructor();
	function constructor(message : string);
}

native class RangeError extends Error {
	function constructor();
	function constructor(message : string);
}

native class ReferenceError extends Error {
	function constructor();
	function constructor(message : string);
}

native class SyntaxError extends Error {
	function constructor();
	function constructor(message : string);
}

native class TypeError extends Error {
	function constructor();
	function constructor(message : string);
}

// 5.12

native final class JSON {

	static function parse(text : string) : variant;
	static function parse(text : string, reviver : function(key:string, value:variant):variant) : variant;

	static function stringify(value : variant) : string;
	static function stringify(value : variant, replacer : function(key:string,value:variant):variant) : string;
	static function stringify(value : variant, replacer : function(key:string,value:variant):variant, space : int) : string;

}

native final class JSX {
	static function profilerIsRunning() : boolean;
	static function getProfileResults() : variant;
	static function postProfileResults(url : string) : void;
}

// vim: set noexpandtab:

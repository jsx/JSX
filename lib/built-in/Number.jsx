native class Number {

	// 15.7.2
	function initialize();
	function initialize(value : number);

	// 15.7.3
	static var MAX_VALUE : number;
	static var MIN_VALUE : number;
	static var NaN : number;
	static var NEGATIVE_INFINITY : number;
	static var POSITIVE_INFINITY : number;
	
	// 15.7.4
	function toString() : String;
	function toString(radix : int) : String;
	function toLocaleString() : String;
	function valueOf() : number;
	function toFixed(fractionDigits : int) : String;
	function toExpotential(fractionDigits : int) : String;
	function toPrecision(precision : int) : String;
}

// vim: set noexpandtab:

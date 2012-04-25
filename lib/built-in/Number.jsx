native final class Number {

	// 15.7.2
	function initialize();
	function initialize(value : number);

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
}

// vim: set noexpandtab:

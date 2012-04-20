native final class Array.<T> {

	// 15.4.4
	function toString() : String;
	function toLocaleString() : String;
	function concat(a : Array.<T>) : Array.<T>; // FIXME more arguments
	function join() : String;
	function join(separator : String) : String;
	function pop() : MayBeUndefined.<T>;
	function push(item : T) : int; // FIXME more arguments
	function reverse() : Array.<T>;
	function shift() : MayBeUndefined.<T>;
	function slice(start : int) : Array.<T>;
	function slice(start : int, end : int) : Array.<T>;
	function sort() : Array.<T>;
	function sort(comparefn : static function (x : MayBeUndefined.<T>, y : MayBeUndefined.<T>) : int) : Array.<T>;
	function splice(start : int, deleteCount : int) : Array.<T>; // FIXME more arguments
	function unshift(item : T) : int; // FIXME more arguments

}

// vim: set noexpandtab:

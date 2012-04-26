native final class Array.<T> {

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
	function splice(start : int, deleteCount : int) : Array.<T>; // FIXME more arguments
	function unshift(item : T) : int; // FIXME more arguments

}

// vim: set noexpandtab:

native final class String {

	// 15.5.2
	function initialize();
	function initialize(s : String);

	// 15.5.3
	static function fromCharCode(char0 : int) : String; // FIXME support vararg

	// 15.5.4
	function toString() : String;
	function valueOf() : String;
	function charAt(pos : int) : String;
	function charCodeAt(pos : int) : int;
	function concat(string1 : String) : String; // FIXME support vararg
	function indexOf(searchString : String) : int;
	function indexOf(searchString : String, position : int) : int;
	function lastIndexOf(searchString : String) : int;
	function lastIndexOf(searchString : String, position : int) : int;
	// FIXME localeCompare?
	// FIXME function match(regexp : RegExp) : String [];
	function replace(searchValue : String, replaceValue : String) : String;
	// FIXME function replace(searchValue : String, replaceValue : function) : String;
	// FIXME function replace(searchValue : RegExp, replaceValue : String) : String;
	// FIXME function replace(searchValue : RegExp, replaceValue : function) : String;
	function search(searchValue : String) : int;
	// FIXME function search(searchValue : RegExp) : int;
	function slice(start : int, end : int) : String;
	function split(separator : String) : String [];
	function split(separator : String, limit : int) : String [];
	// FIXME function split(separator : RegExp) : String [];
	// FIXME function split(separator : RegExp, limit : int) : String [];
	function substring(start : int, end : int) : String;
	function toLowerCase() : String;
	function toLocaleLowerCase() : String;
	function toUpperCase() : String;
	function toLocaleUpperCase() : String;

	// 15.5.5
	var length : int;
}

// vim: set noexpandtab:

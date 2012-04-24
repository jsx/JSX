native final class String {

	// 15.5.2
	function initialize();
	function initialize(s : string);
	function initialize(s : String);

	// 15.5.3
	static function fromCharCode(char0 : int) : string; // FIXME support vararg

	// 15.5.4
	function toString() : string;
	function valueOf() : string;
	function charAt(pos : int) : string;
	function charCodeAt(pos : int) : int;
	function concat(string1 : String) : string; // FIXME support vararg
	function indexOf(searchString : string) : int;
	function indexOf(searchString : string, position : int) : int;
	function lastIndexOf(searchString : string) : int;
	function lastIndexOf(searchString : string, position : int) : int;
	// FIXME localeCompare?
	// FIXME function match(regexp : RegExp) : string [];
	function replace(searchValue : string, replaceValue : string) : string;
	// FIXME function replace(searchValue : string, replaceValue : function) : string;
	function replace(searchValue : RegExp, replaceValue : string) : string;
	// FIXME function replace(searchValue : RegExp, replaceValue : function) : string;
	function search(searchValue : string) : int;
	// FIXME function search(searchValue : RegExp) : int;
	function slice(start : int, end : int) : string;
	function split(separator : string) : string [];
	function split(separator : string, limit : int) : string [];
	// FIXME function split(separator : RegExp) : string [];
	// FIXME function split(separator : RegExp, limit : int) : string [];
	function substring(start : int, end : int) : string;
	function toLowerCase() : string;
	function toLocaleLowerCase() : string;
	function toUpperCase() : string;
	function toLocaleUpperCase() : string;

	// 15.5.5
	var length : int;
}

// vim: set noexpandtab:

// 15.10 RegExp
native final class RegExp {

	function initialize(pattern :String, flags :String);
	function initialize(pattern :String);

	// FIXME: the matched object is a variation of String[],
	//        but has "index", "input" and "lastIndex" properties
	function exec(str :String) :String[];

	function test(str :String) :boolean;

	function toString() :String;

	const var source :String;
	const var global :boolean;
	const var ignoreCase :boolean;
	const var multiline :boolean;
	const var lastIndex :int;

}

// vim: set noexpandtab:

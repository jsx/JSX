// 15.10 RegExp
native final class RegExp {

	function initialize(pattern :string, flags :string);
	function initialize(pattern :string);

	// FIXME: the matched object is a variation of string[],
	//        but has "index", "input" and "lastIndex" properties
	function exec(str :string) :string[];

	function test(str :string) :boolean;

	function toString() :string;

	const var source :string;
	const var global :boolean;
	const var ignoreCase :boolean;
	const var multiline :boolean;
	const var lastIndex :int;

}

// vim: set noexpandtab:

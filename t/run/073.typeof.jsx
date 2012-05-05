/*EXPECTED
string
number
string
number
undefined
number!
*/

class Test {
	static function v(value : variant) : variant {
		return value;
	}

	static function run() : void {

		log typeof Test.v("foo");
		log typeof Test.v(42);

		var a = [ "foo", 42 ] : Array.<variant>;

		log typeof a[0];
		log typeof a[1];
		log typeof a[2];

		// operator precedence
		log typeof Test.v(10) + "!";
	}
}

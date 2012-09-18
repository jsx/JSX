/*EXPECTED
string
number
string
number
undefined
number!
*/

class _Main {
	static function v(value : variant) : variant {
		return value;
	}

	static function main(args : string[]) : void {

		log typeof _Main.v("foo");
		log typeof _Main.v(42);

		var a = [ "foo", 42 ] : Array.<variant>;

		log typeof a[0];
		log typeof a[1];
		log typeof a[2];

		// operator precedence
		log typeof _Main.v(10) + "!";
	}
}

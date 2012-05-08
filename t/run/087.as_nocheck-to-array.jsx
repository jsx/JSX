/*EXPECTED
1,2,3
detected invalid cast, value is not an Array or null
*/

class Test {
	static function ok() : variant {
		return [ 1, 2, 3 ];
	}
	static function ng() : variant {
		return {} : Map.<string>;
	}
	static function say(a : number[]) : void {
		log a.join(",");
	}
	static function run() : void {
		Test.say(Test.ok() as __noconvert__ number[]);
		Test.say(Test.ng() as __noconvert__ number[]);
	}
}

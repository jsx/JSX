/*EXPECTED
number
string
*/

class Test {
	static function f(f : function() : number) : void {
		log 'number';
	}
	static function f(f : function() : string) : void {
		log 'string';
	}
	static function run() : void {
		Test.f(function() : number { return 0; });
		Test.f(function() : string { return 's'; });
	}
}

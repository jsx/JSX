/*EXPECTED
number
string
*/

class Test {
	static function f(n : number) : void {
		log "number";
	}
	static function f(s : string) : void {
		log "string";
	}
	static function g(f : function ( : number) : void) : void {
		f(0);
	}
	static function g(f : function ( : string) : void) : void {
		f("");
	}
	static function run() : void {
		Test.g(Test.f as function ( : number) : void);
		Test.g(Test.f as function ( : string) : void);
	}
}

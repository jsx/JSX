/*EXPECTED
true
g1
g2
g1
g2
g1
g2
*/

class Test {
	static function f(funcArg : function() : void) : void {
		log funcArg == null;
	}
	static function g(funcArg : function () : void) : void {
		log "g1";
	}
	static function g(funcArg : function () : number) : void {
		log "g2";
	}
	static function run() : void {
		Test.f(null);
		Test.g(null : function () : void);
		Test.g(null : function () : number);
		Test.g(null as function () : void);
		Test.g(null as function () : number);
		Test.g(null as __noconvert__ function () : void);
		Test.g(null as __noconvert__ function () : number);
	}
}

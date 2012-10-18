/*EXPECTED
true
g1
g2
g1
g2
g1
g2
*/

class _Main {
	static function f(funcArg : function() : void) : void {
		log funcArg == null;
	}
	static function g(funcArg : function () : void) : void {
		log "g1";
	}
	static function g(funcArg : function () : number) : void {
		log "g2";
	}
	static function main(args : string[]) : void {
		_Main.f(null);
		_Main.g(null : function () : void);
		_Main.g(null : function () : number);
		_Main.g(null as function () : void);
		_Main.g(null as function () : number);
		_Main.g(null as __noconvert__ function () : void);
		_Main.g(null as __noconvert__ function () : number);
	}
}

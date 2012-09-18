/*EXPECTED
number
string
*/

class _Main {
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
	static function main(args : string[]) : void {
		_Main.g(_Main.f as function ( : number) : void);
		_Main.g(_Main.f as function ( : string) : void);
	}
}

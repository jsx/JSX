/*EXPECTED
number
string
*/

class _Main {
	static function f(f : function() : number) : void {
		log 'number';
	}
	static function f(f : function() : string) : void {
		log 'string';
	}
	static function main(args : string[]) : void {
		_Main.f(function() : number { return 0; });
		_Main.f(function() : string { return 's'; });
	}
}

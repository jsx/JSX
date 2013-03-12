/*EXPECTED
hello
*/
class _Main {

	static function hoge (f : (string) -> void) : void {}
	static function hoge (f : (number) -> void) : void {
		log 'hello';
	}

	static function x (f : (number) -> void) : void {
		f(0);
	}

	static function main (args : string[]) : void {
		_Main.x(function fuga (i) {
			_Main.hoge(fuga);
		});
	}
}
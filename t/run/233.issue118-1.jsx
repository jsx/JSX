/*EXPECTED
hello
*/
class _Main {

	static function hoge (f : (string) -> void) : void {}
	static function hoge (f : (number) -> void) : void {
		log 'hello';
	}

	static function main (args : string[]) : void {
		var x : (number) -> void;

		x = function fuga (i) {
			_Main.hoge(fuga);
		};

		x(0);
	}
}
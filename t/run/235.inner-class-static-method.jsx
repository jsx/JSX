/*EXPECTED
hello
*/
class _Main {

	class Inner {
		static function hello () : void {
			log 'hello';
		}
	}

	static function main (args : string[]) : void {
		_Main.Inner.hello();
	}
}
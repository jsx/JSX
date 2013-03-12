/*EXPECTED
hello
*/
class _Main {

	class Inner {
		class Innermore {
			class Innermost {
				static function hello () : void {
					log 'hello';
				}
			}
		}
	}

	static function main (args : string[]) : void {
		_Main.Inner.Innermore.Innermost.hello();
	}
}
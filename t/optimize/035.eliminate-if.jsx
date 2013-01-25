/*EXPECTED
Hello
JSX
World
*/
/*JSX_OPTS
--optimize dce
*/

class _Main {
	static function main(args : string[]) : void {
		if (true) {
			log 'Hello';
			log 'JSX';
		}

		if (false) {
			log 'blah blah';
			log 'blah blah';
		}

		if (false) {
			log 'JSX';
		} else {
			log 'World';
		}
	}
}

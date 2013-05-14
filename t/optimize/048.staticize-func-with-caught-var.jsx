/*EXPECTED
2
*/
/*JSX_OPTS
--optimize staticize --minify
*/
import "console.jsx";

class _Main {
	final function foo () : void {
		function bar () : void {
			try {
				log 1 + 1;
			} catch (e : Error) {
				log e.stack;
			}
		}
		bar();
	}
	static function main (args : string[]) : void {
		(new _Main).foo();
	}
}
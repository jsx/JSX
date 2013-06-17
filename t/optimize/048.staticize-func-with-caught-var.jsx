/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize staticize --minify
*/
import "console.jsx";

class _Main {
	final function foo () : void {
		try {
			log "foo";
		} catch (e : Error) {
			log e;
		}
	}
	static function main (args : string[]) : void {
		(new _Main).foo();
	}
}
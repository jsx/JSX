/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize staticize
*/
import "js.jsx";

__export__ class _Main {
	final function foo () : void {
		log 'foo';
	}
	static function main(args : string[]) : void {
		js.eval("(new (JSX.require('t/optimize/044.staticize-exported-non-virtual.jsx')._Main)).foo()");
	}
}

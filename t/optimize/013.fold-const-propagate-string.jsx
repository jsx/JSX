/*EXPECTED
hello world
*/
/*JSX_OPTS
--optimize fold-const
*/

class _Main {
	static const HELLO = "hello";
	static const WORLD = "world";
	static const HELLO_WORLD = _Main.HELLO + " " + _Main.WORLD;
	static function main(args : string[]) : void {
		log _Main.HELLO_WORLD;
	}
}

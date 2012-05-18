/*EXPECTED
hello world
*/
/*JSX_OPTS
--optimize fold-const
*/

class Test {
	static const HELLO = "hello";
	static const WORLD = "world";
	static const HELLO_WORLD = Test.HELLO + " " + Test.WORLD;
	static function run() : void {
		log Test.HELLO_WORLD;
	}
}

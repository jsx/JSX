/*EXPECTED
foo
bar
*/
import "./211.native-duplicated/a.jsx" into a;
import "./211.native-duplicated/b.jsx" into b;

class Test {
	static function run() : void {
		a.console.log("foo");
		b.console.log("bar");
	}
}

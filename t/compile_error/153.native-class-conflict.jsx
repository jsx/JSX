import "./153.native-class-conflict/a.jsx" into a;
import "./153.native-class-conflict/b.jsx" into b;

class Test {
	static function run() : void {
		a.console.log("foo");
		b.console.log("bar");
	}
}

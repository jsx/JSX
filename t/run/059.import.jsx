/*EXPECTED
hello
goodbye
*/

import "059.import/hello.jsx";
import "059.import/sub/goodbye.jsx";

class Test {
	static function run() : void {
		new Hello().say();
		new Goodbye().say();
	}
}

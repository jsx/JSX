/*EXPECTED
hello
goodbye
*/

import "059.import/hello.jsx";
import "059.import/sub/goodbye.jsx";

class _Main {
	static function main(args : string[]) : void {
		new Hello().say();
		new Goodbye().say();
	}
}

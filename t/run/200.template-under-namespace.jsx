/*EXPECTED
hello
*/
import "200.template-under-namespace/a.jsx" into a;

class Test {
	static function run() : void {
		a.T.<Test>.doit();
	}
	static function say() : void {
		log "hello";
	}
}

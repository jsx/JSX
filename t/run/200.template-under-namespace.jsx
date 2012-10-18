/*EXPECTED
hello
*/
import "200.template-under-namespace/a.jsx" into a;

class _Main {
	static function main(args : string[]) : void {
		a.T.<_Main>.doit();
	}
	static function say() : void {
		log "hello";
	}
}

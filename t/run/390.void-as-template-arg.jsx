/*EXPECTED
hello
*/
class Foo.<T> {
	static function callIt(f : () -> T) : void {
		f();
	}
}

class _Main {
	static function main(args : string[]) : void {
		Foo.<void>.callIt(function () {
			log "hello";
		});
	}
}

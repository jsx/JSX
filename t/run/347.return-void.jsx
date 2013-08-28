/*EXPECTED
hello
*/
class _Main {
	static function hello () : void {
		log "hello";
	}
	static function say () : void {
		return _Main.hello();
	}
	static function main(args : string[]) : void {
		_Main.say();
	}
}

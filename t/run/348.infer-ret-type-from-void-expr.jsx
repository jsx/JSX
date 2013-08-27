/*EXPECTED
hello
*/
class _Main {
	static function hello () : void {
		log "hello";
	}
	static function main(args : string[]) : void {
		(function () {
			return _Main.hello();
		})();
	}
}

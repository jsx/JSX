/*EXPECTED
hello
*/

class _Main {
	function constructor() {
		log "hello";
	}
	static function main(args : string[]) : void {
		new _Main;
	}
}

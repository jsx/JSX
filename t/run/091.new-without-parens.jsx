/*EXPECTED
hello
*/

class Test {
	function constructor() {
		log "hello";
	}
	static function run() : void {
		new Test;
	}
}

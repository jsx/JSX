/*EXPECTED
hello
*/

class _Main {
	var message = "hello";

	function constructor() {
		var f = function() : void { };
		log this.message;
	}

	static function main(args : string[]) : void {
		new _Main();
	}
}

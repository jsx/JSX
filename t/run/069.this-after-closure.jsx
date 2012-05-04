/*EXPECTED
hello
*/

class Test {
	var message = "hello";

	function constructor() {
		var f = function() : void { };
		log this.message;
	}

	static function run() : void {
		new Test();
	}
}

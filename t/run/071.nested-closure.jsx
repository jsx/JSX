/*EXPECTED
hello
world
*/

class Test {
	var foo = "hello";

	function constructor() {
		(function () : void {
			(function() : void {
				log this.foo;
				this.foo = "world";
			})();
		})();
		log this.foo;
	}

	static function run() : void {
		new Test();
	}
}

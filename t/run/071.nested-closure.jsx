/*EXPECTED
hello
world
*/

class _Main {
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

	static function main(args : string[]) : void {
		new _Main();
	}
}

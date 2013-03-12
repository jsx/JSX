/*EXPECTED
123
123
*/
class _Main {

	class Box.<T> {
		var value : T;

		function constructor (value : T) {
			this.value = value;
		}
	}

	static function main(args : string[]) : void {
		var box1 = new _Main.Box.<number>(123);
		log box1.value;
		var box2 = new _Main.Box.<string>("123");
		log box2.value;
	}
}
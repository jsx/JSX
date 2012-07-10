/*EXPECTED
Error: hi
*/
class C.<T> {
	function constructor() {
		try {
			throw new Error("hi");
		} catch (e : Error) {
			log e.toString();
		}
	}
}
class Test {
	static function run() : void {
		new C.<number>;
	}
}

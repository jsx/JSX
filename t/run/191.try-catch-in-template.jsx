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
class _Main {
	static function main(args : string[]) : void {
		new C.<number>;
	}
}

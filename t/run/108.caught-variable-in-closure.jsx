/*EXPECTED
123
*/

class Test {
	static function run() : void {
		try {
			throw 123;
		} catch (e : variant) {
			function () : void {
				log e as string;
			}();
		}
	}
}

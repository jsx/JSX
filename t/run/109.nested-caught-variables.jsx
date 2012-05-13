/*EXPECTED
123,abc
*/

class Test {
	static function run() : void {
		try {
			throw 123;
		} catch (e : variant) {
			try {
				throw "abc";
			} catch (e2 : variant) {
				log e as string + "," + e2 as string;
			}
		}
	}
}

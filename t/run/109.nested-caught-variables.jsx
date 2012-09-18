/*EXPECTED
123,abc
*/

class _Main {
	static function main(args : string[]) : void {
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

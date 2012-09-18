/*EXPECTED
123
*/

class _Main {
	static function main(args : string[]) : void {
		try {
			throw 123;
		} catch (e : variant) {
			(function () : void {
				log e as string;
			})();
		}
	}
}

/*EXPECTED
[object Object]
*/

class _Main {
	static function main(args : string[]) : void {
		var m = {
			toString: 1
		};
		log m.toString();
	}
}

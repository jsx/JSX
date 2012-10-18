/*EXPECTED
hello
*/
class _Main {
	static var f = function() : string {
		return "hello";
	};
	static function main(args : string[]) : void {
		log _Main.f();
	}
}

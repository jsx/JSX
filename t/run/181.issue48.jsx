/*EXPECTED
*/
class _Main {
	static var x : Nullable.<Array.<number>> = null;
	static var y : Nullable.<number[]> = null;
	static function main(args : string[]) : void {
		_Main.x = [ 1, 2, 3 ];
		_Main.y = [ 1, 2, 3 ];
	}
}

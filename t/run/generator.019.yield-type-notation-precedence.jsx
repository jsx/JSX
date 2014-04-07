/*EXPECTED
*/
class _Main {

	static function main (args : string[]) : void {

		// int yield (int[])
		var g1 : int yield int[] = (function * () : Generator.<int,int[]> {})();

		// (int) -> (int yield int)
		var g2 : (int) -> int yield int = function (a : int) { return (function * () : int yield int {})(); };

		// int yield ((int) -> int)
		var g3 : int yield (int) -> int = (function * () : Generator.<int,(int)->int> {})();

	}
}

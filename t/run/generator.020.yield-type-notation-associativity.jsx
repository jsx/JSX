/*EXPECTED
*/

class _Main {

	static function main (args : string[]) : void {

		var g : int yield int yield int = (function * () : Generator.<int,Generator.<int,int>> {})();

	}
}

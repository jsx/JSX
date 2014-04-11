/*EXPECTED
{ value: undefined, done: true }
*/

class _Main {
	static function main (args : string[]) : void {

		var g = (function * () : Generator.<int,string> {})();

		log g.next();
	}
}

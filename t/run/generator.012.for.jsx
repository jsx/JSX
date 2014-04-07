/*EXPECTED
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: undefined, done: true }
*/

class _Main {
	static function main (args : string[]) : void {

		function * foo (array : int[]) : Generator.<void, int> {
			for (var i = 0; i < array.length; ++i) {
				yield array[i];
			}
		}

		var g = foo([ 1, 2, 3 ]);
		log g.next();
		log g.next();
		log g.next();
		log g.next();

	}
}

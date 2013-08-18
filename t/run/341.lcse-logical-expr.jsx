/*JSX_OPTS
--optimize lcse
*/
/*EXPECTED
ok
*/
class Box {
	var value : Nullable.<string> = "ok";
}
class _Main {
	static function main (args : string[]) : void {

		function print(x : Nullable.<string>) : boolean {
			log x;
			return true;
		}

		var x = new Box;

		if (false && x.value == null || print(x.value)) {} // should not be `false && (tmp = x.value) == null || print(tmp)`

	}
}

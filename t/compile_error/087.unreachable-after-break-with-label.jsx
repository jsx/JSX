/*JSX_OPTS
--warn-error
*/
class T {
	static function f() : void {
	l:
		while (true) {
			do {
				break l;
			} while (false);
		}
	}
}

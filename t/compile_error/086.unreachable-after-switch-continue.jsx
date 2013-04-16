/*JSX_OPTS
--warn-error
*/
class T {
	static function f(n : number) : void {
		while (true) {
			switch (n) {
			default:
				continue;
			}
			log 1;
		}
	}
}

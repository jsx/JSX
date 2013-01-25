/*EXPECTED
hello
*/
/*JSX_OPTS
--optimize inline
*/
class _Main {
	static function hello () : void {
		log 'hello';
	}
	static function main (args : string[]) : void {
		(function () : void {
			(function () : void {
				_Main.hello();
			})();
		})();
	}
}
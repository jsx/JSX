/*EXPECTED
3
*/
/*JSX_OPTS
--optimize array-length
*/
 class _Main {
	static function main(args : string[]) : void {
		var a = [ 0, 1, 2 ];
		for (var i = 0; i < a.length;)
			++i;
		log i;
	}
}

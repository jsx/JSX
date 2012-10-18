/*EXPECTED
1
2
3
*/
class _Main {
	static function main(args : string[]) : void {
		var a = [ 1, 2, 3];
		for (var i = 0, len = a.length; i < len; ++i)
			log a[i];
	}
}

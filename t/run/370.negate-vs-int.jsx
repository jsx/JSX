/*EXPECTED
-2147483648
2147483648
-2147483648
*/
class _Main {
	static function main(args : string[]) : void {
		var n : int = 0x80000000;
		log n;
		log -n;
		n = -n;
		log n;
	}
}

/*EXPECTED
8
1.5
3
12
4
-1
2147483647
*/
class _Main {
	static function main(args : string[]) : void {
		log 2 * 4;
		log 3 / 2;
		log 8 % 5;
		log 3 << 2;
		log 9 >> 1;
		log -1 >> 1;
		log -1 >>> 1;
	}
}

/*EXPECTED
8
1.5
3
12
4
1
2147483647
*/
class Test {
	static function run() : void {
		log 2 * 4; // 8
		log 3 / 2; // 1.5
		log 8 % 5; // 3
		log 3 << 2; // 12
		log 9 >> 1; // 4
		log -1 >> 1; // -1
		log -1 >>> 1; // 2147483647
	}
}

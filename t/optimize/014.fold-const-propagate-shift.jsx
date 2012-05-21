/*EXPECTED
4
65535
-1
*/
/*JSX_OPTS
--optimize fold-const
*/
class Test {
	static function run() : void {
		log 1 << 2;
		log -1 >>> 16;
		log -1 >> 16;
	}
}

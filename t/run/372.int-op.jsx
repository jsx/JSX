/*EXPECTED
-2147483648
-2147483648
2147483647
2147483647
131073
131073
954437177
954437177
2
2
1
1
-1
-1
1
1
-1
-1
*/
class _Main {
	static function main(args : string[]) : void {
		var i : int;
		var j : int;
		var r : int;

		// non-fused, and then fused
		i = 0x40000000; j = 0x40000000;
		r = i + j; log r;
		i += j; log i;

		i = 0xc0000000; j = 0x40000001;
		r = i - j; log r;
		i -= j; log i;

		i = 0x10001; j = 0x10001;
		r = i * j; log r;
		i *= j; log i;

		i = 0x55555555; j = 0x55555555;
		r = i * j; log r;
		i *= j; log i;

		i = 5; j = 2;
		r = i / j; log r;
		i /= j; log i;

		i = 5; j = 2;
		r = i % j; log r;
		i %= j; log i;

		i = -5; j = 2;
		r = i % j; log r;
		i %= j; log i;

		i = 5; j = -2;
		r = i % j; log r;
		i %= j; log i;

		i = -5; j = -2;
		r = i % j; log r;
		i %= j; log i;
	}
}

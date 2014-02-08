/*EXPECTED
-2147483648
2147483647
131073
954437177
2
1
-1
1
-1
*/
class _Main {
	static function main(args : string[]) : void {
		var a = new Array.<int>;
		var j : int;
		var i : number;

		// non-fused, and then fused
		i = 0; a[0] = 0x40000000; j = 0x40000000;
		a[i++] += j; log a[0];

		i = 0; a[0] = 0xc0000000; j = 0x40000001;
		a[i++] -= j; log a[0];

		i = 0; a[0] = 0x10001; j = 0x10001;
		a[i++] *= j; log a[0];

		i = 0; a[0] = 0x55555555; j = 0x55555555;
		a[i++] *= j; log a[0];

		i = 0; a[0] = 5; j = 2;
		a[i++] /= j; log a[0];

		i = 0; a[0] = 5; j = 2;
		a[i++] %= j; log a[0];

		i = 0; a[0] = -5; j = 2;
		a[i++] %= j; log a[0];

		i = 0; a[0] = 5; j = -2;
		a[i++] %= j; log a[0];

		i = 0; a[0] = -5; j = -2;
		a[i++] %= j; log a[0];
	}
}

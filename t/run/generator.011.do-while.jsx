/*EXPECTED
0
1
2
3
end
*/
class _Main {
	static function main (args : string[]) : void {

		function iota (n : number) : g_Enumerable.<number> {
			var i = 0;
			do {
				yield i;
				i++;
			} while (i < n);
		}

		var g = iota(4);
		try {
			while (true) {
				log g.next();
			}
		} catch (e : g_StopIteration) {
			log "end";
		}
	}
}
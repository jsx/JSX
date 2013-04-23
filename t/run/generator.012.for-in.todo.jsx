/*EXPECTED
1
2
3
end
*/
class _Main {
	static function main (args : string[]) : void {

		function foo (ary : number[]) : g_Enumerable.<number> {
			for (var i in ary) {
				yield i;
			}
		}

		var g = foo([1, 2, 3]);
		try {
			while (true) {
				log g.next();
			}
		} catch (e : g_StopIteration) {
			log "end";
		}
	}
}
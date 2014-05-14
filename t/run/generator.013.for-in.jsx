/*EXPECTED
1
2
3
end
*/
class _Main {
	static function main (args : string[]) : void {

		function * foo (map : Map.<string>) : void yield string {
			for (var i in map) {
				yield i;
			}
		}

		var g = foo({ 1:"a", 2:"b", 3:"c" });
		while (true) {
			var v = g.next();
			if (v.done)
				break;
			log v.value;
		}
		log "end";
	}
}

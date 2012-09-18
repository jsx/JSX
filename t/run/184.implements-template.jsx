/*EXPECTED
3
1
3
*/
class Pair.<T1,T2> {
	var first : T1;
	var second : T2;
}
class ScalarAndArray.<T> extends Pair.<T,Array.<T>> {
	function constructor(t : T) {
		this.first = t;
		this.second = [ t ];
	}
}

class _Main {
	static function main(args : string[]) : void {
		var a = new ScalarAndArray.<number>(3);
		log a.first;
		log a.second.length;
		log a.second[0];
	}
}

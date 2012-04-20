/*EXPECTED
false
0
0
null
null
null
undefined
*/
class Test {
	static function run() : void {
		var b : boolean;
		log b;
		var i : int;
		log i;
		var n : number;
		log n;
		var s : String;
		log s;
		var a : int[];
		log a;
		var o : Test;
		log o;
		var u : MayBeUndefined.<number>;
		log u;
	}
}

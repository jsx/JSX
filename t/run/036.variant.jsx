/*EXPECTED
false
0
0
f,a,l,s,e

true
1
1
t,r,u,e

true
1
1.5
1,.,5

true
0
NaN
abc
*/
class Test {
	static function run() : void {
		var v : variant = false;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as String).split("").join(",");
		log "";
		v = true;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as String).split("").join(",");
		log "";
		v = 1.5;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as String).split("").join(",");
		log "";
		v = "abc";
		log v as boolean;
		log v as int;
		log v as number;
		log v as String;
	}
}

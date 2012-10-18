/*EXPECTED
true
false
0
0
n,u,l,l

false
false
0
0
f,a,l,s,e

false
true
1
1
t,r,u,e

false
true
1
1.5
1,.,5

false
true
0
NaN
abc
*/
class _Main {
	static function main(args : string[]) : void {
		var v : variant = null;
		log v == null;
		log v as boolean;
		log v as int;
		log v as number; // may become 0 or NaN
		log (v as string).split("").join(","); // null may be "null" or "undefined"
		log "";
		v = false;
		log v == null;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as string).split("").join(",");
		log "";
		v = true;
		log v == null;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as string).split("").join(",");
		log "";
		v = 1.5;
		log v == null;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as string).split("").join(",");
		log "";
		v = "abc";
		log v == null;
		log v as boolean;
		log v as int;
		log v as number;
		log v as string;
	}
}

/*EXPECTED
true
false
0
NaN
u,n,d,e,f,i,n,e,d

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
class Test {
	static function run() : void {
		var v : variant = undefined;
		log v == undefined;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as string).split("").join(",");
		log "";
		v = false;
		log v == undefined;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as string).split("").join(",");
		log "";
		v = true;
		log v == undefined;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as string).split("").join(",");
		log "";
		v = 1.5;
		log v == undefined;
		log v as boolean;
		log v as int;
		log v as number;
		log (v as string).split("").join(",");
		log "";
		v = "abc";
		log v == undefined;
		log v as boolean;
		log v as int;
		log v as number;
		log v as string;
	}
}

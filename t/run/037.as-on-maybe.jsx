/*EXPECTED
undefined
false
0
0
undefined

false
false
0
0
false

true
true
1
1
true

undefined
false
0
0
undefined

0
false
0
0
0

2
true
2
2
2

undefined
false
0
NaN
undefined

0
false
0
0
0

1.5
true
1
1.5
1.5

undefined
false
0
NaN
undefined


false
0
0


abc
true
0
NaN
abc
*/
class Test {
	static function run() : void {
		var b : MayBeUndefined.<boolean> = undefined;
		log b;
		log b as boolean;
		log b as int;
		log b as number;
		log b as string;
		log "";
		b = false;
		log b;
		log b as boolean;
		log b as int;
		log b as number;
		log b as string;
		log "";
		b = true;
		log b;
		log b as boolean;
		log b as int;
		log b as number;
		log b as string;
		log "";
		var i : MayBeUndefined.<int> = undefined;
		log i;
		log i as boolean;
		log i as int;
		log i as number;
		log i as string;
		log "";
		i = 0;
		log i;
		log i as boolean;
		log i as int;
		log i as number;
		log i as string;
		log "";
		i = 2;
		log i;
		log i as boolean;
		log i as int;
		log i as number;
		log i as string;
		log "";
		var n : MayBeUndefined.<number> = undefined;
		log n;
		log n as boolean;
		log n as int;
		log n as number;
		log n as string;
		log "";
		n = 0;
		log n;
		log n as boolean;
		log n as int;
		log n as number;
		log n as string;
		log "";
		n = 1.5;
		log n;
		log n as boolean;
		log n as int;
		log n as number;
		log n as string;
		log "";
		var s : MayBeUndefined.<string> = undefined;
		log s;
		log s as boolean;
		log s as int;
		log s as number;
		log s as string;
		log "";
		s = "";
		log s;
		log s as boolean;
		log s as int;
		log s as number;
		log s as string;
		log "";
		s = "abc";
		log s;
		log s as boolean;
		log s as int;
		log s as number;
		log s as string;
	}
}

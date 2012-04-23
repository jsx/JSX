/*EXPECTED
false
true
true
true
false

0
1
1
1
1
0

0
1
1
1.5
1.5
NaN

f,a,l,s,e
t,r,u,e
1,.,5
a,b,c
*/
class Test {
	static function run() : void {
		log false as boolean;
		log true as boolean;
		log 1.5 as boolean;
		log "a" as boolean;
		log "" as boolean;
		log "";
		log false as int;
		log true as int;
		log 1 as int;
		log 1.5 as int;
		log "1.5" as int;
		log "aaa" as int;
		log "";
		log false as number;
		log true as number;
		log 1 as number;
		log 1.5 as number;
		log "1.5" as number;
		log "aaa" as number;
		log "";
		log (false as String).split("").join(",");
		log (true as String).split("").join(",");
		log (1.5 as String).split("").join(",");
		log ("abc" as String).split("").join(",");
	}
}

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
class _Main {
	static function main(args : string[]) : void {
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
		log (false as string).split("").join(",");
		log (true as string).split("").join(",");
		log (1.5 as string).split("").join(",");
		log ("abc" as string).split("").join(",");
	}
}

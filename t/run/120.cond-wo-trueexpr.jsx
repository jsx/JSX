/*EXPECTED
yes
yes
1
1
Infinity
yes
1
hi
*/

class Test {
	static function run() : void {
		log "" ?: "yes";
		log "yes" ?: "no";
		log 0 ?: 1;
		log NaN ?: 1;
		log Infinity ?: 0;
		log ((null : String) ?: new String("yes")).toString();
		log [ 0 ][1] ?: 1;
		log [ "abc" ][1] ?: "hi";
	}
}

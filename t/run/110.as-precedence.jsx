/*EXPECTED
x 100
x 100
x 100
x 100
*/

class Test {
	static function run() : void {
		log "x", (99+1) as string;
		log "x " + ((99+1) as string);
		log "x " +  (99+1) as string;
		log "x " + (99+1).toString();
	}
}

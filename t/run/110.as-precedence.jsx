/*EXPECTED
x 100
x 100
x 100
x 100
*/

class _Main {
	static function main(args : string[]) : void {
		log "x", (99+1) as string;
		log "x " + ((99+1) as string);
		log "x " +  (99+1) as string;
		log "x " + (99+1).toString();
	}
}

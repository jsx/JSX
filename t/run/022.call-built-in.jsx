/*EXPECTED
hello
5
a
*/
class Test {
	static function run() : void {
		log "hello".toString();
		log "hello".length;
		log String.fromCharCode(97);
	}
}

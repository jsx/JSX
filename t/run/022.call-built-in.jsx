/*EXPECTED
hello
5
a
abc
*/
class Test {
	static function run() : void {

		log "hello".toString();
		log "hello".length;
		log String.fromCharCode(97);
		var s = "abc";
		log s.toString();

	}
}

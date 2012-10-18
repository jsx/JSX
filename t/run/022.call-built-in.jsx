/*EXPECTED
hello
5
a
abc
10
a
*/
class _Main {
	static function main(args : string[]) : void {

		log "hello".toString();
		log "hello".length;
		log String.fromCharCode(97);
		var s = "abc";
		log s.toString();

		var i = 10;
		log i.toString(); // overloaded
		log i.toString(16);
	}
}

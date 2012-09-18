/*EXPECTED
1
hello
3
hello,,
[["hello",null,null],null]
*/

class _Main {
	static function main(args : string[]) : void {
		var sa = new string[];
		sa[0] = "hello";
		log sa.length;
		log sa.join(",");
		sa = new string[3];
		sa[0] = "hello";
		log sa.length;
		log sa.join(",");

		var saa = new string[][2];
		saa[0] = sa;
		log JSON.stringify(saa);
	}
}

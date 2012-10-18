/*EXPECTED
3
4
4
3
2
2
3
3
*/
class _Main {
	static function main(args : string[]) : void {
		var i = 3;
		log i++; // 3
		log i; // 4
		log i--; // 4
		log i; // 3
		log --i; // 2
		log i; // 2
		log ++i; // 3
		log i; // 3
	}
}

/*EXPECTED
-1
-2
-1
*/

class _Main {
	static function main(args : string[]) : void {
		var x : int = ~ 0; // return type is number
		log ~ 0;
		log ~ 1.5;
		log ~ ([] : number[]).pop(); // test op against maybeundefined<number>
	}
}

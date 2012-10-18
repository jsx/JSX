/*EXPECTED
1,2,3
*/
class _Main {
	static function main(args : string[]) : void {
		log [ 1, 2, 3 ].map.<string>((n : Nullable.<number>) : Nullable.<string> -> n as string).join(",");
	}
}

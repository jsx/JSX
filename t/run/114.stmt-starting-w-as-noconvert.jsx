/*EXPECTED
*/

class _Main {
	static function main(args : string[]) : void {
		// assert that a statement starting with "as __noconvert__" op. succeeds to compile
		((new _Main) as __noconvert__ Map.<variant>)["toString"];
	}
}

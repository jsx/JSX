/*EXPECTED
*/

class Test {
	static function run() : void {
		// assert that a statement starting with "as __noconvert__" op. succeeds to compile
		((new Test) as __noconvert__ Map.<variant>)["toString"];
	}
}

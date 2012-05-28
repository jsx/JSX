/*EXPECTED
1
1
1
*/

class Test {
	static function simple() : void {
		log Math.abs(1);
	}
	static function complex() : void {
		log Math.abs(1 + 0);
		log Math.abs(1 - 2);
	}
	static function run() : void {
		Test.simple();
		Test.complex();
	}
}

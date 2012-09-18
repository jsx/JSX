/*EXPECTED
1
1
1
*/

class _Main {
	static function simple() : void {
		log Math.abs(1);
	}
	static function complex() : void {
		log Math.abs(1 + 0);
		log Math.abs(1 - 2);
	}
	static function main(args : string[]) : void {
		_Main.simple();
		_Main.complex();
	}
}

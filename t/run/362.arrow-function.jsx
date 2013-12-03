/*EXPECTED
4
9
*/
class _Main {
	static function main(args : string[]) :void {
		var f = a : number : number => a * a;
		log f(2);
		var g : (number) -> number = (a) -> a * a;
		log f(3);
	}
}

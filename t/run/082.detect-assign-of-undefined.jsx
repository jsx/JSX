/*EXPECTED
undefined
null access
*/

class Test {
	static function run() : void {
		var a = [ 3 ];
		a.pop();
		var x : Nullable.<number> = a.pop();
		log x;
		var y : number = a.pop();
		log y;
	}
}

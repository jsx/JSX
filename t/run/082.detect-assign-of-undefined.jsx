/*EXPECTED
undefined
detected misuse of 'undefined' as type 'number'
*/

class Test {
	static function run() : void {
		var a = [ 3 ];
		a.pop();
		var x : MayBeUndefined.<number> = a.pop();
		log x;
		var y : number = a.pop();
		log y;
	}
}

/*EXPECTED
abc
ABC
012
*/
class Test {
	static function run() : void {
		var f = String.fromCharCode;
		log f(97, 98, 99);
		var g : function (... : int) : string;
		g = String.fromCharCode;
		log f(65, 66, 67);
		var h : (... int) -> string = String.fromCharCode;
		log h(48, 49, 50);
	}
}

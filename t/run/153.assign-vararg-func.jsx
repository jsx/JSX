/*EXPECTED
abc
ABC
012
*/
class _Main {
	static function main(args : string[]) : void {
		var f = String.fromCharCode;
		log f(97, 98, 99);
		var g : function (... : number) : string;
		g = String.fromCharCode;
		log f(65, 66, 67);
		var h : (... number) -> string = String.fromCharCode;
		log h(48, 49, 50);
	}
}

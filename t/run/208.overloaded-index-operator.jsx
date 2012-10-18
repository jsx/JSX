/*EXPECTED
3
3
*/
native __fake__ class DualArray {
	function __native_index_operator__(idx : number) : number;
	function __native_index_operator__(idx : string) : number;
}

class _Main {
	static function main(args : string[]) : void {
		var da = new Map.<number> as __noconvert__ DualArray;
		da["1"] = 3;
		log da[1];
		log da["1"];
	}
}

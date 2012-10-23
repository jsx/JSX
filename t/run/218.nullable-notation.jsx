/*EXPECTED
123
*/

class Klass {

	var str : string?;

	function constructor(num : number?) {
		if (num == null) {
			this.str = null;
		} else {
			this.str = num as string;
		}
	}
}

class _Main {
	static function main(args : string[]) : void {
		log (new Klass(123)).str;
	}
}

/*EXPECTED
123
*/
class _Main {

	class Box {

		var _value : number;

		function constructor (value : number) {
			this._value = value;
		}

		function getValue () : number {
			return this._value;
		}

	}

	static function box (value : number) : _Main.Box {
		return new _Main.Box(value);
	}

	static function unbox (box : _Main.Box) : number {
		return box.getValue();
	}

	static function main (args : string[]) : void {
		var box = _Main.box(123);
		log _Main.unbox(box);
	}
}
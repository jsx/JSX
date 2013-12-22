class C.<T> {
	var _value : T;
	function constructor(value : T) {
		this._value = value;
	}
	function getValue() : T {
		return this._value;
	}
}

class _Main {
	function foo.<T> (v : T) : C.<T>{
		return new C.<T>();
	}
	static function main (args : string[]) : void {
		log new _Main().foo(1).getValue();
	}
}

abstract class Test {
	abstract function f() : void;
	function g() : void {
		try {
			this.f();
		} catch (e : Error) {
		} catch (e : EvalError) { // prev. line is broader
		}
	}
}

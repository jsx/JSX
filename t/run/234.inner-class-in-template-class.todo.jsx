/*EXPECTED
3
2
1
*/
class Stack.<T> {

	var _contents : Stack.<T>.Cons;

	function constructor () {
		this._contents = null;
	}

	function push (x : T) : void {
		this._contents = new Stack.<T>.Cons(x, this._contents);
	}

	function pop () : T {
		var x = this._contents.head;
		this._contents = this._contents.tail;
		return x;
	}

	function peek () : T {
		return this._contents.head;
	}

	class Cons {
		var head : T;
		var tail : Stack.<T>.Cons;

		function constructor(head : T, tail : Stack.<T>.Cons) {
			this.head = head;
			this.tail = tail;
		}
	}
}

class _Main {
	static function main (args : string[]) : void {
		var stack = new Stack.<number>;
		stack.push(1);
		stack.push(2);
		stack.push(3);
		log stack.pop();
		log stack.pop();
		log stack.pop();
	}
}


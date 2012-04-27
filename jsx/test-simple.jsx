// FIXME: rewirte it with template

class TestSimple_Matcher /* <T> */ {

	var _test :TestSimple;
	var _got  :variant; // FIXME: use T

	function initialize(test :TestSimple, got :variant) {
		this._test = test;
		this._got  = got;
	}

	function toBe(x :variant) :void {
		this._test._ok(this._got == x);
	}
}

class TestSimple {
	var _count = 0;
	var _pass  = 0;

	function initialize(name :string)  {
	}

	function done() :void {
		log "1.." + this._count as string;
	}

	function expect(value :variant) :TestSimple_Matcher {
		return new TestSimple_Matcher(this, value);
	}

	function _ok(value :boolean) :void {
		var c = ++this._count;
		if(value) {
			log "ok " + c as string;
		}
		else {
			log "not ok " + c as string;
		}
	}

	function note(message :string) :void {
		log "# " + message;
	}
}

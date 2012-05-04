class TestMatcher {

	var _test : TestCase;
	var _got  : variant;
	var _name : MayBeUndefined.<string>;

	function constructor(test : TestCase, got : variant) {
		this._test = test;
		this._got  = got;
	}

	function constructor(test : TestCase, got : variant, name : string) {
		this._test = test;
		this._got  = got;
		this._name = name;
	}

	function _match(value : boolean, got : variant, expected : variant, op : string) :string {
		if(value) {
			this._test._ok(this._name);
		}
		else {
			var diag = "comparing with " + op + "\n" +
				"got:      " + got as string + "\n" +
				"expected: " + expected as string + "\n";
			this._test._nok(this._name, diag);
		}
	}

	function toBe(x :  variant) : void {
		this._match(this._got == x,
			this._got, x, "==");
	}
	function notToBe(x :  variant) : void {
		this._match(this._got != x,
			this._got, x, "!=");
	}
	function toBeLT(x :  variant) : void {
		this._match(this._got as number < x as number,
			this._got, x, "<");
	}
	function toBeLE(x :  variant) : void {
		this._match(this._got as number <= x as number,
			this._got, x, "<=");
	}
	function toBeGT(x :  variant) : void {
		this._match(this._got as number > x as number,
			this._got, x, ">");
	}
	function toBeGE(x :  variant) : void {
		this._match(this._got as number >= x as number,
			this._got, x, ">=");
	}
}

class TestCase {
	var _totalCount = 0;
	var _totalPass  = 0;
	var _count = 0;
	var _pass  = 0;
	var _tests : string[];

	function beforeClass(tests : string[]) : void {
		this._tests = tests;
		log "1.." + this._tests.length.toString();
	}

	function afterClass() : void {
		if(this._totalCount != this._totalPass) {
			this.diag("tests failed!");
		}
	}

	function before(name : string) : void {
	}
	function after(name : string) : void {
		log "\t" + "1.." + this._count.toString();
		var name = this._tests[ this._totalCount++ ].replace(/[$].*/, "");

		if(this._count == this._pass) {
			++this._totalPass;
			log "ok", this._totalCount, "-", name;
		}
		else {
			log "not ok", this._totalCount, "-", name;
		}
		this._count = 0;
		this._pass  = 0;
	}

	function done() : void { } // placeholder


	function expect(value : variant) : TestMatcher {
		++this._count;
		return new TestMatcher(this, value);
	}
	function expect(value : variant, message : string) : TestMatcher {
		++this._count;
		return new TestMatcher(this, value, message);
	}

	function _ok(name : MayBeUndefined.<string>) : void {
		++this._pass;
		log "\t" + "ok " + (this._count) as string
			+ (name != undefined ? " - " + name :  "");
	}

	function _nok(name : MayBeUndefined.<string>, diag : string) : void {
		log "\t" + "not ok " + (this._count) as string
			+ (name != undefined ? " - " + name :  "");
		this.diag(diag);
	}

	function fail(reason : string) : void {
		log "not ok - fail";
		this.diag(reason);
	}

	function diag(message : string) : void {
		log message.replace(/^/mg, "# ");
	}

	function note(message : string) : void {
		// TODO skip if the process has no tty
		log message.replace(/^/mg, "# ");
	}

	override
	function toString() : string {
		if (this._tests != null) {
			return "TestCase[" + this._tests.join(", ") + "]";
		}
		else { // before boforeClass()
			return "TestCase";
		}
	}
}

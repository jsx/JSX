import "test-case.jsx";

// just signature tests

class _Test extends TestCase {

	function testArrayES3() : void {
		var a = [1, 3, 2];
		var d : function(:variant) : string = JSON.stringify;

		this.expect(d(a.concat([4])), "join").toBe(d([1, 3, 2, 4]));
		this.expect(d(a.concat([] : number[]).reverse()), "reverse").toBe(d([2, 3, 1]));
		this.expect(d(a.slice(1)), "slice").toBe(d([3, 2]));
		this.expect(d(a.slice(1, 2)), "slice").toBe(d([3]));
		this.expect(d(a.splice(1, 1)), "splice").toBe(d([3]));
		this.expect(d(a), "splice").toBe(d([1, 2]));

        a = [1, 2, 3];
        a.splice(1, 1, 4);
        this.expect(JSON.stringify(a), "splice with an item").toBe(JSON.stringify([1, 4, 3]));
	}

	function testArrayES5() : void {
		var a = [1, 2, 3, 2, 1];

		this.expect(a.indexOf(2), "lastIndex").toBe(1);
		this.expect(a.indexOf(2, 2), "lastIndex").toBe(3);
		this.expect(a.lastIndexOf(2), "lastIndex").toBe(3);
		this.expect(a.lastIndexOf(2, 2), "lastIndex").toBe(1);

		this.expect(a.every(function(v : MayBeUndefined.<number>) : boolean {
			return v > 0;
		})).toBe(true);
		this.expect(a.every(function(v : MayBeUndefined.<number>) : boolean {
			return v > 1;
		})).toBe(false);

		var i = 0;
		this.expect(a.every(function(v : MayBeUndefined.<number>, index : number) : boolean {
			this.expect(index).toBe(i++);
			return true;
		})).toBe(true);

		this.expect(a.every(function(v : MayBeUndefined.<number>, index : number, array : number[]) : boolean {
			this.expect(array).toBe(a);
			return true;
		})).toBe(true);

		this.expect(a.some(function(v : MayBeUndefined.<number>) : boolean {
			return v == 3;
		}), "some").toBe(true);

		i = 0;
		a.forEach(function(v : MayBeUndefined.<number>) : void {
			i += v;
		});
		this.expect(i, "forEach").toBe(1 + 2 + 3 + 2 + 1);

		var b = a.map(function(v : MayBeUndefined.<number>) : MayBeUndefined.<number> {
			return -v;
		});
		this.expect(JSON.stringify(b), "map").toBe(JSON.stringify([-1, -2, -3, -2, -1]));

		b = a.filter(function(v : MayBeUndefined.<number>) : boolean {
			return v > 1;
		});
		this.expect(JSON.stringify(b), "map").toBe(JSON.stringify([ 2, 3, 2 ]));

		var sum = a.reduce(function(p : MayBeUndefined.<number>, c : MayBeUndefined.<number>) : MayBeUndefined.<number> {
			return p + c;
		}, 0);
		this.expect(i, "reduce").toBe(1 + 2 + 3 + 2 + 1);


		sum = a.reduceRight(function(p : MayBeUndefined.<number>, c : MayBeUndefined.<number>) : MayBeUndefined.<number> {
			return p + c;
		}, 0);
		this.expect(i, "reduceRight").toBe(1 + 2 + 3 + 2 + 1);
	}

	function testString() : void {
		this.expect(new String(new String("foo")).toString(), "copy constructor").toBe(new String("foo").toString());

		this.expect("foo".match(/bar/), "match -> null").toBe(null);
		var matched = "foobar".match(/ob(a)/);
		this.expect(matched[0], "match").toBe("oba");
		this.expect(matched[1], "match").toBe("a");

		this.expect("foo".replace(/o/g, "O"), "replace (string)").toBe("fOO");
		this.expect("foo".replace(/o/g, function(s : string) : string {
			return s.toUpperCase();
		}), "replace (function)").toBe("fOO");

		this.expect("foobar".slice(3), "slice 1").toBe("bar");
		this.expect("foobar".slice(3, 5), "slice 2").toBe("ba");
		this.expect("foobar".substring(3), "substring 1").toBe("bar");
		this.expect("foobar".substring(3, 5), "substring 2").toBe("ba");
	}

	function testURI() : void {
		this.expect(String.encodeURIComponent("\tfoo/bar")).toBe("%09foo%2Fbar");
		this.expect(String.decodeURIComponent("%09foo%2Fbar")).toBe("\tfoo/bar");
		this.expect(String.encodeURI("\tfoo/bar")).toBe("%09foo/bar");
		this.expect(String.decodeURI("%09foo/bar")).toBe("\tfoo/bar");
	}

	function testBoolean() : void {
		this.expect(new Boolean(new Boolean(true)).toString(), "copy constructor").toBe(new Boolean(true).toString());
	}

	function testNumber() : void {
		this.expect(new Number(new Number(42)).toString(), "copy constructor").toBe(new Number(42).toString());
	}

	function testRegexp() : void {
		this.expect(new RegExp(/foo/i).toString(), "copy constructor").toBe(/foo/i.toString());

		this.expect(/bar/.test("foo"), "test -> false").toBe(false);
		this.expect(/bar/.test("bar"), "test -> true").toBe(true);

		this.expect(/bar/i.test("BAR"), "/i").toBe(true);
		this.expect(/^bar/.test("foo\nbar"), "/m").toBe(false);
		this.expect(/^bar/m.test("foo\nbar"), "/m").toBe(true);
		this.expect(/\n/.test("foo\nbar"), "\\n").toBe(true);

		this.expect(/bar/.exec("foo"), "exec -> null").toBe(null);

		var matched = /ob(a)/.exec("foobar");
		this.expect(matched[0], "match").toBe("oba");
		this.expect(matched[1], "match").toBe("a");

	}

	function testMath() :void {
		this.expect(Math.E > 0, "E").toBe(true);
		this.expect(Math.LN10 > 0, "LN10").toBe(true);
		this.expect(Math.LN2 > 0, "LN2").toBe(true);
		this.expect(Math.LOG2E > 0, "LN2E").toBe(true);
		this.expect(Math.LOG10E > 0, "LN10E").toBe(true);
		this.expect(Math.PI > 0, "PI").toBe(true);
		this.expect(Math.SQRT1_2 > 0, "SQRT1_2").toBe(true);
		this.expect(Math.SQRT2 > 0, "SQRT2").toBe(true);

		this.expect(Math.abs(-42), "abs").toBe(42);
		this.expect(Math.acos(1), "acos").toBe(0);
		this.expect(Math.asin(0), "asin").toBe(0);
		this.expect(Math.atan(0), "atan").toBe(0);
		this.expect(Math.atan2(0, 2), "atan2").toBe(0);
		this.expect(Math.ceil(10.5), "ceil").toBe(11);
		this.expect(Math.cos(Math.PI), "cos").toBe(-1);
		this.expect(Math.exp(0), "exp").toBe(1);
		this.expect(Math.floor(10.5), "floor").toBe(10);
		this.expect(Math.max(10, 20), "max").toBe(20);
		this.expect(Math.min(10, 20), "min").toBe(10);
		this.expect(Math.pow(3, 3), "pow").toBe(27);
		this.expect(Math.random() > 0, "random").toBe(true);
		this.expect(Math.round(10.5), "round").toBe(11);
		this.expect(Math.sin(0), "sin").toBe(0);
		this.expect(Math.sqrt(9), "sqrt").toBe(3);
		this.expect(Math.tan(0), "tan").toBe(0);

		this.expect(Math.log(1), "log").toBe(0);
	}
}

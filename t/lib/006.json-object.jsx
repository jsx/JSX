import "json-object.jsx";
import "test-case.jsx";

// some tests come from https://github.com/douglascrockford/JSON-java

class _Test extends TestCase {

	function testNull() : void {
        var jsonobject = new JSONObject("{\"message\":\"null\"}");
        this.expect(jsonobject.isNull("message")).toBe(false);
        this.expect(jsonobject.getString("message")).toBe("null");

        jsonobject = new JSONObject("{\"message\":null}");
        this.expect(jsonobject.isNull("message")).toBe(true);
	}

	function testToString_ListofLists() : void {
		var src = "{\"list of lists\":[[1,2,3],[4,5,6]]}";
		var jsonobject = new JSONObject(src);

		this.expect(jsonobject.toString()).toBe(src);

		this.expect( jsonobject.getJSONArray("list of lists").toString() )
			.toBe("[[1,2,3],[4,5,6]]");
    }

	function testMultipleThings() : void {
		var eps = 2.220446049250313e-16;

		var src = '{"foo": [true, false,9876543210,    '
			+ '0.0, 1.00000001,  1.000000000001, 1.00000000000000001, '
			+ ' 0.00000000000000001, 2.00, 0.1, 2e100, -32,[],{},'
			+ '\"string\"], '
			+ '  "to"   : null, "op" : "Good",'
			+ ' "ten":10 }';

		var jsonobject = new JSONObject(src);
		jsonobject.put("String", "98.6");
		jsonobject.put("JSONObject", new JSONObject());
		jsonobject.put("JSONArray", new JSONArray());
		jsonobject.put("int", 57);
		jsonobject.put("double", 123456789012345678901234567890);
		jsonobject.put("true", true);
		jsonobject.put("false", false);
		jsonobject.put("null", JSONObject.NULL);
		jsonobject.put("bool", "true");
		jsonobject.put("zero", -0.0);
		jsonobject.put("\\u2028", "\u2028");
		jsonobject.put("\\u2029", "\u2029");
		var jsonarray = jsonobject.getJSONArray("foo");
		jsonarray.push(666);
		jsonarray.push(2001.99);
		jsonarray.push("so \"fine\".");
		jsonarray.push("so <fine>.");
		jsonarray.push(true);
		jsonarray.push(false);
		jsonarray.push(new JSONArray());
		jsonarray.push(new JSONObject());
		jsonobject.put("keys", jsonobject.keys());

		this.expect(jsonobject.getNumber("String") - 98.6).toBeLE(eps);
		this.expect(jsonobject.getBoolean("bool")).toBe(true);
		this.expect(jsonobject.getJSONArray("foo").toString())
			.toBe(
				"[true,false,9876543210,0,1.00000001,1.000000000001,1,1e-17,2,0.1,2e+100,-32,[],{},\"string\",666,2001.99,\"so \\\"fine\\\".\",\"so <fine>.\",true,false,[],{}]");

		this.expect(jsonobject.getString("op")).toBe("Good");
		this.expect(jsonobject.getInt("ten")).toBe(10);
		this.expect(jsonobject.getBoolean("oops")).toBe(false);
    }

	function testException() : void {
		try {
			var j = new JSONObject("{");
			this.fail("unexpected");
		}
		catch(e : Error) {
			this.expect(e instanceof Error, "parse error").toBe(true);
		}

		var j = new JSONObject();
		j.put("foo", new JSONObject);

		try {
			j.getNumber("foo");
			this.fail("unexpected");
		}
		catch(e : Error) {
			this.expect(e instanceof TypeError, "getNumber").toBe(true);
		}

		try {
			j.getInt("foo");
			this.fail("unexpected");
		}
		catch(e : Error) {
			this.expect(e instanceof TypeError, "getInt").toBe(true);
		}

		try {
			j.getBoolean("foo");
			this.fail("unexpected");
		}
		catch(e : Error) {
			this.expect(e instanceof TypeError, "getBoolean").toBe(true);
		}

		try {
			j.getString("foo");
			this.fail("unexpected");
		}
		catch(e : Error) {
			this.expect(e instanceof TypeError, "getString").toBe(true);
		}

		var a = new JSONArray();
		a.put(0, {} : Map.<variant>);

		try {
			a.getNumber(0);
			this.fail("unexpected");
		}
		catch(e : Error) {
			this.expect(e instanceof TypeError, "getNumber").toBe(true);
		}

		try {
			a.getInt(0);
			this.fail("unexpected");
		}
		catch(e : Error) {
			this.expect(e instanceof TypeError, "getInt").toBe(true);
		}

		try {
			a.getBoolean(0);
			this.fail("unexpected");
		}
		catch(e : Error) {
			this.expect(e instanceof TypeError, "getBoolean").toBe(true);
		}

		try {
			a.getString(0);
			this.fail("unexpected");
		}
		catch(e : Error) {
			this.expect(e instanceof TypeError, "getString").toBe(true);
		}
	}


	function testHas() : void {
		var j = new JSONObject('{ "foo" : null, "bar" : true }');

		this.expect(j.has("foo")).toBe(true);
		this.expect(j.has("bar")).toBe(true);
		this.expect(j.has("baz")).toBe(false);
	}

	function testJSONObject_Basic() : void {
		var j = new JSONObject();
		j.put("n", 10);
		j.put("b", true);
		j.put("s", "foo");

		this.expect(j.getNumber("n")).toBe(10);
		this.expect(j.getBoolean("b")).toBe(true);
		this.expect(j.getString("s")).toBe("foo");

		this.expect(j.toString()).toBe('{"n":10,"b":true,"s":"foo"}');
		this.expect(j.toString(2)).toBe(
			'{\n'
			+ '  "n": 10,\n'
			+ '  "b": true,\n'
			+ '  "s": "foo"\n'
			+ '}');
	}

	function testJSONArray_Basic() : void {
		var j = new JSONArray();
		j.push(10);
		j.push(true);
		j.push("foo");

		this.expect(j.getLength()).toBe(3);

		this.expect(j.getNumber(0)).toBe(10);
		this.expect(j.getBoolean(1)).toBe(true);
		this.expect(j.getString(2)).toBe("foo");

		this.expect(j.toString()).toBe('[10,true,"foo"]');
		this.expect(j.toString(2)).toBe(
			'[\n'
			+ '  10,\n'
			+ '  true,\n'
			+ '  "foo"\n'
			+ ']');
	}

}

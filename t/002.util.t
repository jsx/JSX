// JSX_TEST
import "test-case.jsx";
import "../src/util.jsx";

class _Test extends TestCase {
	function testFormat() : void {
		this.expect( Util.format("foo", new string[]) ).toBe("foo");
		this.expect( Util.format("foo %1", ["bar"])).toBe("foo bar");
		this.expect( Util.format("foo %1 %1", ["bar"])).toBe("foo bar bar");
		this.expect( Util.format("foo %2 %1", ["bar", "baz"]) ).toBe('foo baz bar');
		this.expect( Util.format("100%%1 %1", ["foo"]) ).toBe("100%1 foo");
	}

	function testRepeat() : void {
		this.expect( Util.repeat("x", 4) ).toBe("xxxx");
		this.expect( Util.repeat("ab", 4) ).toBe("abababab");
		this.expect( Util.repeat("z", 0) ).toBe("");
	}

	function testEncodeStringLiteral() : void {
		this.expect(Util.encodeStringLiteral("")).toBe('""');
		this.expect(Util.encodeStringLiteral("abc")).toBe('"abc"');
		this.expect(Util.encodeStringLiteral('"')).toBe('"\\""');
		this.expect(Util.encodeStringLiteral('\0')).toBe('"\\0"');
		this.expect(Util.encodeStringLiteral('\\')).toBe('"\\\\"');
		this.expect(Util.encodeStringLiteral('\u0345')).toBe('"\\u0345"');
	}

	function testDecodeStringLiteral() : void {
		this.expect(Util.decodeStringLiteral("''")).toBe("");
		this.expect(Util.decodeStringLiteral('""')).toBe("");
		this.expect(Util.decodeStringLiteral("'abc'")).toBe("abc");
		this.expect(Util.decodeStringLiteral("'\\''")).toBe("'");
		this.expect(Util.decodeStringLiteral('"\\""')).toBe('"');
		this.expect(Util.decodeStringLiteral("'\\\\'")).toBe("\\");
		this.expect(Util.decodeStringLiteral("'\\b'")).toBe("\b");
		this.expect(Util.decodeStringLiteral("'\\f'")).toBe("\f");
		this.expect(Util.decodeStringLiteral("'\\n'")).toBe("\n");
		this.expect(Util.decodeStringLiteral("'\\t'")).toBe("\t");
		this.expect(Util.decodeStringLiteral("'\\v'")).toBe("\v");
		this.expect(Util.decodeStringLiteral("'\\u0041'")).toBe("A");
		this.expect(Util.decodeStringLiteral("'\\0'")).toBe("\0");
		this.expect(Util.decodeStringLiteral("'!\\u0041!\\0!\\n!'")).toBe("!A!\0!\n!");
	}

	function testResolvePath() : void {
		this.expect(Util.resolvePath("a/b/c")).toBe("a/b/c");
		this.expect(Util.resolvePath("a/./b")).toBe("a/b");
		this.expect(Util.resolvePath("a/../b")).toBe("b");
		this.expect(Util.resolvePath("a/../../b")).toBe("../b");
		this.expect(Util.resolvePath("../../a")).toBe("../../a");
		this.expect(Util.resolvePath("/a/b/c")).toBe("/a/b/c");
		this.expect(Util.resolvePath("/a/../b")).toBe("/b");
		this.expect(Util.resolvePath("/a/../../c")).toBe("/c");
	}

}


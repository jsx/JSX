// JSX_TEST
import "test-case.jsx";
import "../../src/util.jsx";

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
		this.expect(Util.encodeStringLiteral(" ")).toBe('" "');
		this.expect(Util.encodeStringLiteral('"')).toBe('"\\""');
		this.expect(Util.encodeStringLiteral('\0')).toBe('"\\0"');
		this.expect(Util.encodeStringLiteral('\\')).toBe('"\\\\"');
		this.expect(Util.encodeStringLiteral('\r')).toBe('"\\r"');
		this.expect(Util.encodeStringLiteral('\n')).toBe('"\\n"');
		this.expect(Util.encodeStringLiteral('\t')).toBe('"\\t"');
		this.expect(Util.encodeStringLiteral('\u0345')).toBe('"\\u0345"');

		this.expect(Util.encodeStringLiteral('foo\nbar\nbaz\n')).toBe('"foo\\nbar\\nbaz\\n"');
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

		this.expect(Util.decodeStringLiteral("'\\x61'")).toBe("a");
		this.expect(Util.decodeStringLiteral("'\\x66\\x6f\\x6f'")).toBe("foo");
	}

	function testResolvePath() : void {
		this.expect(Util.resolvePath("a/b/c")).toBe("a/b/c");
		this.expect(Util.resolvePath("a/./b")).toBe("a/b");
		this.expect(Util.resolvePath("./a/b")).toBe("a/b");
		this.expect(Util.resolvePath("a/../b")).toBe("b");
		this.expect(Util.resolvePath("a/../../b")).toBe("../b");
		this.expect(Util.resolvePath("../../a")).toBe("../../a");
		this.expect(Util.resolvePath("/a")).toBe("/a");
		this.expect(Util.resolvePath("/a/b/c")).toBe("/a/b/c");
		this.expect(Util.resolvePath("/a/../b")).toBe("/b");
		this.expect(Util.resolvePath("/a/b/../../c")).toBe("/c");
		this.expect(Util.resolvePath("/a/../../c")).toBe("c");
		this.expect(Util.resolvePath("a//b//c")).toBe("a/b/c");

		this.expect(Util.resolvePath("a\\b\\c")).toBe("a/b/c");

		this.expect(Util.resolvePath("."), ".").toBe(".");
		this.expect(Util.resolvePath("/"), "/").toBe("/");
	}

	function testRelativePath() : void {
		this.expect(Util.relativePath("a/b/c", "a/b/d", false)).toBe("../d");
		this.expect(Util.relativePath("a/b/c", "a/x/d", false)).toBe("../../x/d");
		this.expect(Util.relativePath("/a/b/c", "a/b/d", false), "for abs path").toBe("../d");
		this.expect(Util.relativePath("/a/b/c", "a/x/d", false), "for abs path").toBe("../../x/d");

		this.expect(Util.relativePath("a/b/c", "a/b/d",  true)).toBe("d");
		this.expect(Util.relativePath("a/b/c", "a/x/d",  true)).toBe("../x/d");
		this.expect(Util.relativePath("/a/b/c", "a/b/d", true), "for abs path").toBe("d");
		this.expect(Util.relativePath("/a/b/c", "a/x/d", true), "for abs path").toBe("../x/d");
	}

	function testDirname() : void {
		this.expect(Util.dirname("/foo/bar")).toBe("/foo");
		this.expect(Util.dirname("/foo//bar")).toBe("/foo");
		this.expect(Util.dirname("foo/bar")).toBe("foo");
		this.expect(Util.dirname("foo//bar")).toBe("foo");

		this.expect(Util.dirname("t//t")).toBe("t");
		this.expect(Util.dirname("")).toBe(".");
	}

	function testToOrdinal() : void {
		this.expect(Util.toOrdinal(1)).toBe("1st");
		this.expect(Util.toOrdinal(2)).toBe("2nd");
		this.expect(Util.toOrdinal(3)).toBe("3rd");
		this.expect(Util.toOrdinal(4)).toBe("4th");

		this.expect(Util.toOrdinal(10)).toBe("10th");
		this.expect(Util.toOrdinal(11)).toBe("11th");
		this.expect(Util.toOrdinal(12)).toBe("12th");
		this.expect(Util.toOrdinal(13)).toBe("13th");

		this.expect(Util.toOrdinal(20)).toBe("20th");
		this.expect(Util.toOrdinal(21)).toBe("21st");
		this.expect(Util.toOrdinal(22)).toBe("22nd");
		this.expect(Util.toOrdinal(23)).toBe("23rd");
	}

	function testTypedMap() : void {
		var map = new TypedMap.<Pair.<int,int>,int>((a, b) -> {
			return a.first == b.first && a.second == b.second;
		});

		map.set(new Pair.<int,int>(10, 20), 30);
		map.set(new Pair.<int,int>(10, 20), 40);
		map.set(new Pair.<int,int>(10, 30), 50);
		map.set(new Pair.<int,int>(20, 30), 60);

		this.expect(map.has(new Pair.<int,int>(10, 20)), "has").toBe(true);
		this.expect(map.has(new Pair.<int,int>(20, 20)), "has").toBe(false);

		this.expect(map.get(new Pair.<int,int>(10, 20)), "get").toBe(40);
		this.expect(map.get(new Pair.<int,int>(20, 20)), "get").toBe(null);

		this.expect(map.get(new Pair.<int,int>(20, 30)), "get").toBe(60);
		map.delete(new Pair.<int,int>(20, 30));
		this.expect(map.get(new Pair.<int,int>(20, 30)), "get").toBe(null);

		map.clear();
		this.expect(map.has(new Pair.<int,int>(10, 20)), "has after clear").toBe(false);
		this.expect(map.has(new Pair.<int,int>(20, 20)), "has after clear").toBe(false);
	}

	function testLD() : void {
		this.expect(Util.ld("apple", "apple")).toBe(0);
		this.expect(Util.ld("apple", "play")).toBe(4);
	}
}


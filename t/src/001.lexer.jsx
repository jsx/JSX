// JSX_TEST
import "test-case.jsx";
import _Lexer from "../../src/parser.jsx";

class _Test extends TestCase {

	function lexerTest(rx : RegExp, good : string[], bad : string[]) : void {
		this.note("matched");
		var i;
		var matched;
		for(i = 0; i < good.length; ++i) {
			matched = good[i].match(rx);
			this.expect(matched, JSON.stringify(good[i])).notToBe(null);
			if(matched) {
				this.expect(matched[0]).toBe(good[i]);
			}
		}

		this.note("not matched");
		for(i = 0; i < bad.length; ++i) {
			matched = bad[i].match(rx);
			this.expect(matched, JSON.stringify(bad[i])).toBe(null);
		}
	}

	function testRxIdent() : void {
		this.diag('tokenize identifiers');

		var good = [
			"foo",
			"bar",
			"abcdefghijklmnopqrstuvwxyz",
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"f",
			"_foo",
			"_",
			"foo_",
			"foo123",
			"foo_123",
			"varfoo",
			"var_foo",
			"var123"
			];
		var bad = [
			"123",
			"$foo",
			" ",
			".",
			"/",
			"+",
			"-",
			"-foo",
			" ",
			"\n"
			];

		this.lexerTest(_Lexer.rxIdent, good, bad);
	}

	function testRxNumberLiteral() : void {
		this.diag('tokenize numbers');

		var good = [
			"123456789.0",
			"3.14",
			".012",
			"0.012",
			"0.012e8",
			"0.e8",
			"0.e+8",
			"0.e-8",
			"1e32",
			"1E32",
			"0E0",
			"NaN",
			"Infinity",
			"0.0"
			];
		var bad = [
			"1a2",
			"1x2",
			"foo",
			"..2",
			"2..",
			"x2",
			"!42",
			"+",
			"nan",
			"infinity",
			" "
			];

		this.lexerTest(_Lexer.rxNumberLiteral, good, bad);
	}

	function testRxIntegerLiteral() : void {
		this.diag('tokenize integers');

		var good = [
			"1",
			"42",
			"1234567890",
			"0xabcdef123",
			"0XABCDEF123",

			"0"
			// TODO: list ECMA 262 compatible
			];
		var bad = [
			"3.14",
			".012",
			"0.012",
			"0.012e8",
			"0.e8",
			"1e32",
			"1E32",
			"0E0",
			"0xGG",
			"0xZZ",
			"088",
			"0b1212",

			"+"
			];

		this.lexerTest(_Lexer.rxIntegerLiteral, good, bad);
	}

	function testRxStringLiteral() : void {
		this.diag('tokenize strings');

		var good = [
			'"foo"',
			'"foo bar"',
			'"foo\\"bar"',
			'"foo\\n"',
			'""',
			"'foo'",
			"'foo bar'",
			"'foo\\'bar'",
			"'foo\\n'",
			"''"
			];

		var bad = [
			'"',
			"'",
			''
			];

		this.lexerTest(_Lexer.rxStringLiteral, good, bad);
	}

	function testRxRegExpLiteral() : void {
		this.diag("tokenize regular expressions");

		var good = [
			'/foo/',
			'/foo\\/bar/',
			'/[a-zA-Z]/',
			'/foo/i',
			'/foo/m',
			'/foo/g',
			'/foo/img',
			'/foo/igm',
			'/foo/mgi',
			'/foo/mgi',
			'/foo/gim',
			'/foo/gmi',
			'/./'
			];

		var bad = [
			"/",
			" "
			];

		this.lexerTest(_Lexer.rxRegExpLiteral, good, bad);
	}

}

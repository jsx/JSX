import "test-case.jsx";

class _Test extends TestCase {

	function testTCEqualsTrue() : void {
		this.expect(this.equals(
					"foo",
					"foo"
					)).toBe(true);

		this.expect(this.equals(
					null,
					null
					)).toBe(true);

		this.expect(this.equals(
					[1, 2, 3],
					[1, 2, 3]
					)).toBe(true);
		this.expect(this.equals(
					[ [1], [2], [3]],
					[ [1], [2], [3]]
					)).toBe(true);

		this.expect(this.equals(
					{ foo: 10, bar: 20 },
					{ foo: 10, bar: 20 }
					)).toBe(true);

		this.expect(this.equals(
					{ foo: 10, bar: 20 },
					{ bar: 20, foo: 10 }
					)).toBe(true);

		this.expect(this.equals(
					[{ foo: 10, bar: 20 }],
					[{ foo: 10, bar: 20 }]
					)).toBe(true);

		this.expect(this.equals(
					[new Date(0)],
					[new Date(0)]
					)).toBe(true);
	}

	function testTCEqualsFalse() : void {
		this.expect(this.equals(
					0,
					null
					)).toBe(false);

		this.expect(this.equals(
					"",
					null
					)).toBe(false);

		this.expect(this.equals([1, 2, 3, 0], [1, 2, 3])).toBe(false);
		this.expect(this.equals([1, 2, 3],    [1, 2, 3, 0])).toBe(false);
		this.expect(this.equals([1, 2, 4],    [1, 2, 3])).toBe(false);

		this.expect(this.equals(
					{ foo: 10, bar: 20 },
					{ foo: 10, bar: 21 }
					)).toBe(false);

		this.expect(this.equals(
					{ foo: 10, bar: 20 },
					{ foo: 10, baz: 20 }
					)).toBe(false);

		this.expect(this.equals(
					[new Date(0)],
					[new Date(1)]
					)).toBe(true);
	}
}

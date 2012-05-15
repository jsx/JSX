import "typedarray.jsx";
import "test-case.jsx";

class _Test extends TestCase {
	function test_Int8Array() : void {
		var a = new Int8Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(undefined);

		this.expect(a.byteLength).toBe(3);

		a = new Int8Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);
	}

	function test_Uint8Array() : void {
		var a = new Uint8Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(undefined);

		this.expect(a.byteLength).toBe(3);

		a = new Uint8Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);
	}

	function test_Int16Array() : void {
		var a = new Int16Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(undefined);

		this.expect(a.byteLength).toBe(3 * 2);

		a = new Int16Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);
	}

	function test_Uint16Array() : void {
		var a = new Uint16Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(undefined);

		this.expect(a.byteLength).toBe(3 * 2);

		a = new Uint16Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);
	}

	function test_Int32Array() : void {
		var a = new Int32Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(undefined);

		this.expect(a.byteLength).toBe(3 * 4);

		a = new Int32Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);
	}

	function test_Uint32Array() : void {
		var a = new Uint32Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(undefined);

		this.expect(a.byteLength).toBe(3 * 4);

		a = new Uint32Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);
	}

	function test_Float32Array() : void {
		var a = new Float32Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(undefined);

		this.expect(a.byteLength).toBe(3 * 4);

		a = new Float32Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);
	}

	function test_Float64Array() : void {
		var a = new Float64Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(undefined);

		this.expect(a.byteLength).toBe(3 * 8);

		a = new Float64Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);
	}

}

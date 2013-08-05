import "test-case.jsx";

class _Test extends TestCase {
	function test_Int8Array() : void {
		var a = new Int8Array([10, 20, 30] : int[]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(null);

		this.expect(a.byteLength).toBe(3);

		a = new Int8Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);

		a[0] = 20;
		this.expect(a[0]).toBe(20);

		a[0] = 30 as int;
		this.expect(a[0]).toBe(30);
	}

	function test_Uint8Array() : void {
		var a = new Uint8Array([10, 20, 30] : int[]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(null);

		this.expect(a.byteLength).toBe(3);

		a = new Uint8Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);

		a[0] = 20;
		this.expect(a[0]).toBe(20);

		a[0] = 30 as int;
		this.expect(a[0]).toBe(30);
	}

	function test_Int16Array() : void {
		var a = new Int16Array([10, 20, 30] : int[]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(null);

		this.expect(a.byteLength).toBe(3 * 2);

		a = new Int16Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);

		a[0] = 20;
		this.expect(a[0]).toBe(20);

		a[0] = 30 as int;
		this.expect(a[0]).toBe(30);
	}

	function test_Uint16Array() : void {
		var a = new Uint16Array([10, 20, 30] : int[]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(null);

		this.expect(a.byteLength).toBe(3 * 2);

		a = new Uint16Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);

		a[0] = 20;
		this.expect(a[0]).toBe(20);

		a[0] = 30 as int;
		this.expect(a[0]).toBe(30);
	}

	function test_Int32Array() : void {
		var a = new Int32Array([10, 20, 30] : int[]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(null);

		this.expect(a.byteLength).toBe(3 * 4);

		a = new Int32Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);

		a[0] = 20;
		this.expect(a[0]).toBe(20);

		a[0] = 30 as int;
		this.expect(a[0]).toBe(30);
	}

	function test_Uint32Array() : void {
		var a = new Uint32Array([10, 20, 30] : int[]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(null);

		this.expect(a.byteLength).toBe(3 * 4);

		a = new Uint32Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);

		a[0] = 20;
		this.expect(a[0]).toBe(20);

		a[0] = 30 as int;
		this.expect(a[0]).toBe(30);
	}

	function test_Float32Array() : void {
		var a = new Float32Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(null);

		this.expect(a.byteLength).toBe(3 * 4);

		a = new Float32Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);

		a[0] = 20;
		this.expect(a[0]).toBe(20);

		a[0] = 30 as int;
		this.expect(a[0]).toBe(30);
	}

	function test_Float64Array() : void {
		var a = new Float64Array([10, 20, 30]);
		this.expect(a.length).toBe(3);
		this.expect(a[0]).toBe(10);
		this.expect(a[1]).toBe(20);
		this.expect(a[2]).toBe(30);
		this.expect(a[3]).toBe(null);

		this.expect(a.byteLength).toBe(3 * 8);

		a = new Float64Array(10);
		this.expect(a.length).toBe(10);
		this.expect(a[0]).toBe(0);

		a[0] = 20;
		this.expect(a[0]).toBe(20);

		a[0] = 30 as int;
		this.expect(a[0]).toBe(30);
	}

	function test_DataView() : void {
		var b = new Uint8Array([0x10, 0x20, 0x30, 0x40, 0, 0, 0, 0] : int[]);
		var v = new DataView(b.buffer);

		this.expect(v.getInt8(0), 'getInt8').toBe(0x10);
		this.expect(v.getUint8(0), 'getUint8').toBe(0x10);

		this.expect(v.getInt16(0), 'getInt16/BE').toBe(0x1020);
		this.expect(v.getInt16(0, true), 'getInt16/LE').toBe(0x2010);
		this.expect(v.getUint16(0), 'getUint16/BE').toBe(0x1020);
		this.expect(v.getUint16(0, true), 'getUint16/LE').toBe(0x2010);

		this.expect(v.getInt32(0), 'getInt32/BE').toBe(0x10203040);
		this.expect(v.getInt32(0, true), 'getInt32/LE').toBe(0x40302010);
		this.expect(v.getUint32(0), 'getUint32/BE').toBe(0x10203040);
		this.expect(v.getUint32(0, true), 'getUint32/LE').toBe(0x40302010);

		v.setFloat32(0, 123.456);
		this.expect( Math.abs(v.getFloat32(0) - 123.456 ), 'getFloat32').toBeLT(0.001);

		v.setFloat64(0, 123.456);
		this.expect(v.getFloat64(0), 'getFloat64').toBe(123.456);
	}
}

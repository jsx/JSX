// http://www.khronos.org/registry/typedarray/specs/1.0/

// (cf. https://developer.mozilla.org/en/javascript_typed_arrays/ArrayBuffer)

native class ArrayBuffer {
	__readonly__ /* should be const */ var length : number;

	function constructor(size : int);
}

native __fake__ class ArrayBufferView {
    __readonly__ /* should be const */ var buffer : ArrayBuffer;
    __readonly__ /* should be const */ var byteOffset : number;
	__readonly__ /* should be const */ var byteLength : number;

    function __native_index_operator__(n : number) : MayBeUndefined.<number>;
}

native class DataView extends ArrayBufferView {
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : int);
	function constructor(buffer : ArrayBuffer, byteOffset : int, byteLength : int);

	function getInt8(byteOffset : int) : int;
	function getUint8(byteOffset : int) : int;
	function getInt16(byteOffset : int) : int;
	function getInt16(byteOffset : int, littleEndian : boolean) : int;
	function getUint16(byteOffset : int) : int;
	function getUint16(byteOffset : int, littleEndian : boolean) : int;
	function getInt32(byteOffset : int) : int;
	function getInt32(byteOffset : int, littleEndian : boolean) : int;
	function getUint32(byteOffset : int) : int;
	function getUint32(byteOffset : int, littleEndian : boolean) : int;
	function getFloat32(byteOffset : int) : number;
	function getFloat32(byteOffset : int, littleEndian : boolean) : number;
	function getFloat64(byteOffset : int) : number;
	function getFloat64(byteOffset : int, littleEndian : boolean) : number;

	function setInt8(byteOffset : int, value : int) : void;
	function setUint8(byteOffset : int, value : int) : void;
	function setInt16(byteOffset : int, value : int) : void;
	function setInt16(byteOffset : int, value : int, littleEndian : boolean) : void;
	function setUint16(byteOffset : int, value : int, littleEndian : boolean) : void;
	function setUint16(byteOffset : int, value : int) : void;
	function setInt32(byteOffset : int, value : int) : void;
	function setInt32(byteOffset : int, value : int, littleEndian : boolean) : void;
	function setUint32(byteOffset : int, value : int) : void;
	function setUint32(byteOffset : int, value : int, littleEndian : boolean) : void;
	function setFloat32(byteOffset : int, value : number) : void;
	function setFloat32(byteOffset : int, value : number, littleEndian : boolean) : void;
	function setFloat64(byteOffset : int, value : number) : void;
	function setFloat64(byteOffset : int, value : number, littleEndian : boolean) : void;

}

// TypedArray

native class Int8Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : int;

	__readonly__ /* should be const */ var length : int;

	function constructor(size : int);
	function constructor(array : Int8Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : int);
	function constructor(buffer : ArrayBuffer, byteOffset : int, length : int);
}

native class Uint8Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : int;

	__readonly__ /* should be const */ var length : int;

	function constructor(size : int);
	function constructor(array : Uint8Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : int);
	function constructor(buffer : ArrayBuffer, byteOffset : int, length : int);
}

native class Int16Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : int;

	__readonly__ /* should be const */ var length : int;

	function constructor(size : int);
	function constructor(array : Int16Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : int);
	function constructor(buffer : ArrayBuffer, byteOffset : int, length : int);
}

native class Uint16Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : int;

	__readonly__ /* should be const */ var length : int;

	function constructor(size : int);
	function constructor(array : Uint16Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : int);
	function constructor(buffer : ArrayBuffer, byteOffset : int, length : int);
}

native class Int32Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : int;

	__readonly__ /* should be const */ var length : int;

	function constructor(size : int);
	function constructor(array : Int32Array);
	function constructor(array : int[]);
	function constructor(array : number[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : int);
	function constructor(buffer : ArrayBuffer, byteOffset : int, length : int);
}

native class Uint32Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : int;

	__readonly__ /* should be const */ var length : int;

	function constructor(size : int);
	function constructor(array : Uint32Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : int);
	function constructor(buffer : ArrayBuffer, byteOffset : int, length : int);
}

native class Float32Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : int;

	__readonly__ /* should be const */ var length : int;

	function constructor(size : int);
	function constructor(array : Float32Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : int);
	function constructor(buffer : ArrayBuffer, byteOffset : int, length : int);
}
native class Float64Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : number;

	__readonly__ /* should be const */ var length : int;

	function constructor(size : int);
	function constructor(array : Float64Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : int);
	function constructor(buffer : ArrayBuffer, byteOffset : int, length : int);
}


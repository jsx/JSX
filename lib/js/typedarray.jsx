// http://www.khronos.org/registry/typedarray/specs/1.0/

// (cf. https://developer.mozilla.org/en/javascript_typed_arrays/ArrayBuffer)

// generated from http://www.khronos.org/registry/typedarray/specs/latest/
native class ArrayBuffer {
	function constructor(length : int/*unsigned long*/);

	__readonly__ var byteLength : int/*unsigned long*/;
	function slice(begin : int/*long*/) : ArrayBuffer;
	function slice(begin : int/*long*/, end : int/*long*/) : ArrayBuffer;
}

native class ArrayBufferView {
	// FIXME: delete function constructor();
	__readonly__ var buffer : ArrayBuffer;
	__readonly__ var byteOffset : int/*unsigned long*/;
	__readonly__ var byteLength : int/*unsigned long*/;
}

native class Int8Array extends ArrayBufferView {

	function constructor(length : int/*unsigned long*/);
	function constructor(array : Int8Array);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		length : int/*unsigned long*/
	);

	static const BYTES_PER_ELEMENT : int/*unsigned long*/;
	__readonly__ var length : int/*unsigned long*/;
	function __native_index_operator__(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* getter */ get(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* setter */ set(
		index : int/*unsigned long*/,
		value : int
	) : void;
	function set(array : Int8Array) : void;
	function set(
		array : Int8Array,
		offset : int/*unsigned long*/
	) : void;
	function set(array : int[]) : void;
	function set(array : int[], offset : int/*unsigned long*/) : void;
	function subarray(begin : int/*long*/) : Int8Array;
	function subarray(
		begin : int/*long*/,
		end : int/*long*/
	) : Int8Array;
}

native class Uint8Array extends ArrayBufferView {

	function constructor(length : int/*unsigned long*/);
	function constructor(array : Uint8Array);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		length : int/*unsigned long*/
	);

	static const BYTES_PER_ELEMENT : int/*unsigned long*/;
	__readonly__ var length : int/*unsigned long*/;
	function __native_index_operator__(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* getter */ get(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* setter */ set(
		index : int/*unsigned long*/,
		value : int
	) : void;
	function set(array : Uint8Array) : void;
	function set(
		array : Uint8Array,
		offset : int/*unsigned long*/
	) : void;
	function set(array : int[]) : void;
	function set(array : int[], offset : int/*unsigned long*/) : void;
	function subarray(begin : int/*long*/) : Uint8Array;
	function subarray(
		begin : int/*long*/,
		end : int/*long*/
	) : Uint8Array;
}

native class Int16Array extends ArrayBufferView {

	function constructor(length : int/*unsigned long*/);
	function constructor(array : Int16Array);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		length : int/*unsigned long*/
	);

	static const BYTES_PER_ELEMENT : int/*unsigned long*/;
	__readonly__ var length : int/*unsigned long*/;
	function __native_index_operator__(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* getter */ get(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* setter */ set(
		index : int/*unsigned long*/,
		value : int
	) : void;
	function set(array : Int16Array) : void;
	function set(
		array : Int16Array,
		offset : int/*unsigned long*/
	) : void;
	function set(array : int[]) : void;
	function set(array : int[], offset : int/*unsigned long*/) : void;
	function subarray(begin : int/*long*/) : Int16Array;
	function subarray(
		begin : int/*long*/,
		end : int/*long*/
	) : Int16Array;
}

native class Uint16Array extends ArrayBufferView {

	function constructor(length : int/*unsigned long*/);
	function constructor(array : Uint16Array);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		length : int/*unsigned long*/
	);

	static const BYTES_PER_ELEMENT : int/*unsigned long*/;
	__readonly__ var length : int/*unsigned long*/;
	function __native_index_operator__(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* getter */ get(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* setter */ set(
		index : int/*unsigned long*/,
		value : int
	) : void;
	function set(array : Uint16Array) : void;
	function set(
		array : Uint16Array,
		offset : int/*unsigned long*/
	) : void;
	function set(array : int[]) : void;
	function set(array : int[], offset : int/*unsigned long*/) : void;
	function subarray(begin : int/*long*/) : Uint16Array;
	function subarray(
		begin : int/*long*/,
		end : int/*long*/
	) : Uint16Array;
}

native class Int32Array extends ArrayBufferView {

	function constructor(length : int/*unsigned long*/);
	function constructor(array : Int32Array);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		length : int/*unsigned long*/
	);

	static const BYTES_PER_ELEMENT : int/*unsigned long*/;
	__readonly__ var length : int/*unsigned long*/;
	function __native_index_operator__(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* getter */ get(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* setter */ set(
		index : int/*unsigned long*/,
		value : int
	) : void;
	function set(array : Int32Array) : void;
	function set(
		array : Int32Array,
		offset : int/*unsigned long*/
	) : void;
	function set(array : int[]) : void;
	function set(array : int[], offset : int/*unsigned long*/) : void;
	function subarray(begin : int/*long*/) : Int32Array;
	function subarray(
		begin : int/*long*/,
		end : int/*long*/
	) : Int32Array;
}

native class Uint32Array extends ArrayBufferView {

	function constructor(length : int/*unsigned long*/);
	function constructor(array : Uint32Array);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		length : int/*unsigned long*/
	);

	static const BYTES_PER_ELEMENT : int/*unsigned long*/;
	__readonly__ var length : int/*unsigned long*/;
	function __native_index_operator__(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* getter */ get(
		index : int/*unsigned long*/
	) : MayBeUndefined.<int>;
	function /* setter */ set(
		index : int/*unsigned long*/,
		value : int
	) : void;
	function set(array : Uint32Array) : void;
	function set(
		array : Uint32Array,
		offset : int/*unsigned long*/
	) : void;
	function set(array : int[]) : void;
	function set(array : int[], offset : int/*unsigned long*/) : void;
	function subarray(begin : int/*long*/) : Uint32Array;
	function subarray(
		begin : int/*long*/,
		end : int/*long*/
	) : Uint32Array;
}

native class Float32Array extends ArrayBufferView {

	function constructor(length : int/*unsigned long*/);
	function constructor(array : Float32Array);
	function constructor(array : number[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		length : int/*unsigned long*/
	);

	static const BYTES_PER_ELEMENT : int/*unsigned long*/;
	__readonly__ var length : int/*unsigned long*/;
	function __native_index_operator__(
		index : int/*unsigned long*/
	) : MayBeUndefined.<number>;
	function /* getter */ get(
		index : int/*unsigned long*/
	) : MayBeUndefined.<number>;
	function /* setter */ set(
		index : int/*unsigned long*/,
		value : number
	) : void;
	function set(array : Float32Array) : void;
	function set(
		array : Float32Array,
		offset : int/*unsigned long*/
	) : void;
	function set(array : number[]) : void;
	function set(array : number[], offset : int/*unsigned long*/) : void;
	function subarray(begin : int/*long*/) : Float32Array;
	function subarray(
		begin : int/*long*/,
		end : int/*long*/
	) : Float32Array;
}

native class Float64Array extends ArrayBufferView {

	function constructor(length : int/*unsigned long*/);
	function constructor(array : Float64Array);
	function constructor(array : number[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		length : int/*unsigned long*/
	);

	static const BYTES_PER_ELEMENT : int/*unsigned long*/;
	__readonly__ var length : int/*unsigned long*/;
	function __native_index_operator__(
		index : int/*unsigned long*/
	) : MayBeUndefined.<number>;
	function /* getter */ get(
		index : int/*unsigned long*/
	) : MayBeUndefined.<number>;
	function /* setter */ set(
		index : int/*unsigned long*/,
		value : number
	) : void;
	function set(array : Float64Array) : void;
	function set(
		array : Float64Array,
		offset : int/*unsigned long*/
	) : void;
	function set(array : number[]) : void;
	function set(array : number[], offset : int/*unsigned long*/) : void;
	function subarray(begin : int/*long*/) : Float64Array;
	function subarray(
		begin : int/*long*/,
		end : int/*long*/
	) : Float64Array;
}



native class Uint8ClampedArray extends Uint8Array {
	function constructor(length : int/*unsigned long*/);
	function constructor(array : Uint8ClampedArray);
	function constructor(array : Uint8Array);
	function constructor(array : int[]/*octet[]*/);
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		length : int/*unsigned long*/
	);

	static const BYTES_PER_ELEMENT : int/*unsigned long*/;
	function set(array : Uint8ClampedArray) : void;
	function set(
		array : Uint8ClampedArray,
		offset : int/*unsigned long*/
	) : void;
	override function subarray(begin : int/*long*/) : Uint8ClampedArray;
	override function subarray(
		begin : int/*long*/,
		end : int/*long*/
	) : Uint8ClampedArray;
}

native class DataView extends ArrayBufferView {
	function constructor(buffer : ArrayBuffer);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/
	);
	function constructor(
		buffer : ArrayBuffer,
		byteOffset : int/*unsigned long*/,
		byteLength : int/*unsigned long*/
	);

	// Gets the value of the given type at the specified byte offset
	// from the start of the view. There is no alignment constraint
	// multi-byte values may be fetched from any offset.
	//
	// For multi-byte values, the optional littleEndian argument
	// indicates whether a big-endian or little-endian value should be
	// read. If false or undefined, a big-endian value is read.
	//
	// These methods raise an exception if they would read
	// beyond the end of the view.
	function getInt8(byteOffset : int/*unsigned long*/) : int/*byte*/;
	function getUint8(byteOffset : int/*unsigned long*/) : int/*octet*/;
	function getInt16(byteOffset : int/*unsigned long*/) : int/*short*/;
	function getInt16(
		byteOffset : int/*unsigned long*/,
		littleEndian : boolean
	) : int/*short*/;
	function getUint16(
		byteOffset : int/*unsigned long*/
	) : int/*unsigned short*/;
	function getUint16(
		byteOffset : int/*unsigned long*/,
		littleEndian : boolean
	) : int/*unsigned short*/;
	function getInt32(byteOffset : int/*unsigned long*/) : int/*long*/;
	function getInt32(
		byteOffset : int/*unsigned long*/,
		littleEndian : boolean
	) : int/*long*/;
	function getUint32(
		byteOffset : int/*unsigned long*/
	) : int/*unsigned long*/;
	function getUint32(
		byteOffset : int/*unsigned long*/,
		littleEndian : boolean
	) : int/*unsigned long*/;
	function getFloat32(
		byteOffset : int/*unsigned long*/
	) : number/*float*/;
	function getFloat32(
		byteOffset : int/*unsigned long*/,
		littleEndian : boolean
	) : number/*float*/;
	function getFloat64(
		byteOffset : int/*unsigned long*/
	) : number/*double*/;
	function getFloat64(
		byteOffset : int/*unsigned long*/,
		littleEndian : boolean
	) : number/*double*/;
	// Stores a value of the given type at the specified byte offset
	// from the start of the view. There is no alignment constraint
	// multi-byte values may be stored at any offset.
	//
	// For multi-byte values, the optional littleEndian argument
	// indicates whether the value should be stored in big-endian or
	// little-endian byte order. If false or undefined, the value is
	// stored in big-endian byte order.
	//
	// These methods raise an exception if they would write
	// beyond the end of the view.
	function setInt8(
		byteOffset : int/*unsigned long*/,
		value : int/*byte*/
	) : void;
	function setUint8(
		byteOffset : int/*unsigned long*/,
		value : int/*octet*/
	) : void;
	function setInt16(
		byteOffset : int/*unsigned long*/,
		value : int/*short*/
	) : void;
	function setInt16(
		byteOffset : int/*unsigned long*/,
		value : int/*short*/,
		littleEndian : boolean
	) : void;
	function setUint16(
		byteOffset : int/*unsigned long*/,
		value : int/*unsigned short*/
	) : void;
	function setUint16(
		byteOffset : int/*unsigned long*/,
		value : int/*unsigned short*/,
		littleEndian : boolean
	) : void;
	function setInt32(
		byteOffset : int/*unsigned long*/,
		value : int/*long*/
	) : void;
	function setInt32(
		byteOffset : int/*unsigned long*/,
		value : int/*long*/,
		littleEndian : boolean
	) : void;
	function setUint32(
		byteOffset : int/*unsigned long*/,
		value : int/*unsigned long*/
	) : void;
	function setUint32(
		byteOffset : int/*unsigned long*/,
		value : int/*unsigned long*/,
		littleEndian : boolean
	) : void;
	function setFloat32(
		byteOffset : int/*unsigned long*/,
		value : number/*float*/
	) : void;
	function setFloat32(
		byteOffset : int/*unsigned long*/,
		value : number/*float*/,
		littleEndian : boolean
	) : void;
	function setFloat64(
		byteOffset : int/*unsigned long*/,
		value : number/*double*/
	) : void;
	function setFloat64(
		byteOffset : int/*unsigned long*/,
		value : number/*double*/,
		littleEndian : boolean
	) : void;
}


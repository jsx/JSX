// http://www.khronos.org/registry/typedarray/specs/1.0/

// (cf. https://developer.mozilla.org/en/javascript_typed_arrays/ArrayBuffer)

native class ArrayBuffer {
	const length : number;
}

native __fake__ class ArrayBufferView {
    const buffer : ArrayBuffer;
    const byteOffset : number;
	const byteLength : number;

    function __native_index_operator__(n : number) : MayBeUndefined.<number>;
}

native class DataView extends ArrayBufferView {
    // TODO
}

// TypedArray
native class Int8Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : number;

	const length : number;

	function constructor(size : number);
	function constructor(array : Int8Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : number);
	function constructor(buffer : ArrayBuffer, byteOffset : number, length : number); 
}
native class Uint8Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : number;

	const length : number;

	function constructor(size : number);
	function constructor(array : Uint8Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : number);
	function constructor(buffer : ArrayBuffer, byteOffset : number, length : number); 
}
native class Int16Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : number;

	const length : number;

	function constructor(size : number);
	function constructor(array : Int16Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : number);
	function constructor(buffer : ArrayBuffer, byteOffset : number, length : number); 
}
native class Uint16Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : number;

	const length : number;

	function constructor(size : number);
	function constructor(array : Uint16Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : number);
	function constructor(buffer : ArrayBuffer, byteOffset : number, length : number); 
}
native class Int32Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : number;

	const length : number;

	function constructor(size : number);
	function constructor(array : Int32Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : number);
	function constructor(buffer : ArrayBuffer, byteOffset : number, length : number); 
}
native class Uint32Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : number;

	const length : number;

	function constructor(size : number);
	function constructor(array : Uint32Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : number);
	function constructor(buffer : ArrayBuffer, byteOffset : number, length : number); 
}
native class Float32Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : number;

	const length : number;

	function constructor(size : number);
	function constructor(array : Float32Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : number);
	function constructor(buffer : ArrayBuffer, byteOffset : number, length : number); 
}
native class Float64Array extends ArrayBufferView {
	static const BYTES_PER_ELEMENT : number;

	const length : number;

	function constructor(size : number);
	function constructor(array : Float64Array);
	function constructor(array : number[]);
	function constructor(array : int[]);
	function constructor(buffer : ArrayBuffer);
	function constructor(buffer : ArrayBuffer, byteOffset : number);
	function constructor(buffer : ArrayBuffer, byteOffset : number, length : number); 
}


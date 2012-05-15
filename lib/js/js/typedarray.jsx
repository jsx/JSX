interface ArrayBuffer {}
interface ArrayBufferView {
	abstract const length : number;
}

// TypedArray
native class Int8Array implements ArrayBufferView {
	const length : number;
}
native class Uint8Array implements ArrayBufferView {
	const length : number;
}
native class Int16Array implements ArrayBufferView {
	const length : number;
}
native class Uint16Array implements ArrayBufferView {
	const length : number;
}
native class Int32Array implements ArrayBufferView {
	const length : number;
}
native class Uint32Array implements ArrayBufferView {
	const length : number;
}
native class Float32Array implements ArrayBufferView {
	const length : number;
}
native class Float64Array implements ArrayBufferView {
	const length : number;
}



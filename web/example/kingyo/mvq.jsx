import 'js/web.jsx';

class MVQ {
	static const EQUAL_EPSILON = 0.000001;
}

class V2 {
	// members
	var x = 0;
	var y = 0;

	// get as array
	function array() : number[] {return [this.x, this.y];}

	// constructors
	function constructor() {} // nop
	function constructor(v:V2) {this.set(v);} // copy constructor
	function constructor(v:number[]) {this.set(v);} // from array
	function constructor(v:Float32Array) {this.set(v);} // from typedarray
	function constructor(x:number, y:number) {this.set(x, y);} // from elements

	// dim conversion
	function constructor(v:V3) {this.set(v.x, v.y);}
	function constructor(v:V4) {this.set(v.x, v.y);}
	function V3(z:number) : V3 {return new V3(this, z);}
	function V4(z:number, w:number) : V4 {return new V4(this, z, w);}
	function set(v:V3): V2 {return this.set(v.x, v.y);}
	function set(v:V4): V2 {return this.set(v.x, v.y);}

	function clone() : V2 {return new V2(this);}
	function clear() : V2 {return this.set(0, 0);}

	function set(x:number, y:number) : V2 {
		this.x = x; this.y = y;
		return this;
	}
	function set(v:V2): V2 {this.set(v.x, v.y); return this;}
	function set(v:number[]) : V2 {
		assert(v.length == 2);
		this.set(v[0], v[1]);
		return this;
	}
	function set(v:Float32Array) : V2 {
		assert(v.length == 2);
		this.set(v[0], v[1]);
		return this;
	}

	function equals(v:V2) : boolean {
		return this.equals(v, MVQ.EQUAL_EPSILON);
	}
	function equals(v:V2, eps:number) : boolean {
		return
			Math.abs(v.x - this.x) < eps &&
			Math.abs(v.y - this.y) < eps;
	}

	// this = this + v
	function add(x:number, y:number) : V2 {
		this.x += x; this.y += y;
		return this;
	}
	function add(v:V2): V2 {return this.add(v.x, v.y);}
	function add(v:number[]) : V2 {return this.add(v[0], v[1]);}
	function add(v:Float32Array) : V2 {return this.add(v[0], v[1]);}

	// this = this - v
	function sub(x:number, y:number) : V2 {
		this.x -= x; this.y -= y;
		return this;
	}
	function sub(v:V2): V2 {return this.sub(v.x, v.y);}
	function sub(v:number[]) : V2 {return this.sub(v[0], v[1]);}
	function sub(v:Float32Array) : V2 {return this.sub(v[0], v[1]);}

	// this = this * v (for each element)
	function mul(x:number, y:number) : V2 {
		this.x *= x; this.y *= y;
		return this;
	}
	function mul(v:V2): V2 {return this.mul(v.x, v.y);}
	function mul(v:number[]) : V2 {return this.mul(v[0], v[1]);}
	function mul(v:Float32Array) : V2 {return this.mul(v[0], v[1]);}

	// this = this * s
	function mul(s:number) : V2 {
		this.x *= s;
		this.y *= s;
		return this;
	}

	// this = -this
	function neg() : V2 {
		return this.mul(-1);
	}

	// this = normalize(this)
	function normalize() : V2 {
		var l = this.len();
		if (l > 0) {
			return this.mul(1 / l);
		} else {
			return this;
		}
	}

	// return this x v
	function cross(v:V2) : number {
		return this.x * v.y - v.x * this.y;
	}

	// return this . v
	function dot(v:V2) : number {
	    return this.x * v.x + this.y * v.y;
	}

	// return len(this)
	function len() : number {
		return Math.sqrt(this.len2());
	}

	// return len(this)^2
	function len2() : number {
		var x = this.x, y = this.y;
		return x * x + y * y;
	}

	// return len(this - v)
	function dist(v:V2) : number {
		return Math.sqrt(this.dist2(v));
	}

	// return len(this - v)^2
	function dist2(v:V2) : number {
		var x = v.x - this.x;
		var y = v.y - this.y;
		return x * x + y * y;
	}

	// this = (1 - ratio) * v0 + ratio *  v1
	function lerp(v0:V2, v1:V2, ratio:number) : V2 {
		this.x = v0.x + ratio * (v1.x - v0.x);
		this.y = v0.y + ratio * (v1.y - v0.y);
		return this;
	}

	// this = m * this
	function transformBy(m:M22) : V2 {
		var x = this.x, y = this.y;
		this.x = m.m11 * x + m.m12 * y;
		this.y = m.m21 * x + m.m22 * y;
		return this;
	}

	// this = m * this (affine transform)
	function transformBy(m:M33) : V2 {
		var x = this.x, y = this.y;
		this.x = m.m11 * x + m.m12 * y + m.m13;
		this.y = m.m21 * x + m.m22 * y + m.m23;
		return this;
	}

	override function toString() : string {
		return "V2" + JSON.stringify(this.array());
	}
}

class V3 {
	// members
	var x = 0;
	var y = 0;
	var z = 0;

	// get as array
	function array() : number[] {return [this.x, this.y, this.z];}

	// constructors
	function constructor() {} // nop
	function constructor(v:V3) {this.set(v);} // copy constructor
	function constructor(v:number[]) {this.set(v);} // from array
	function constructor(v:Float32Array) {this.set(v);} // from typedarray
	function constructor(x:number, y:number, z:number) {this.set(x, y, z);} // from elements

	// dim conversion
	function constructor(v:V2, z:number) {this.set(v, z);}
	function constructor(v:V4) {this.set(v);}
	function V2() : V2 {return new V2(this);}
	function V4(w:number) : V4 {return new V4(this, w);}
	function set(v:V2, z:number): V3 {return this.set(v.x, v.y, z);}
	function set(v:V4): V3 {return this.set(v.x, v.y, v.z);}

	function clone() : V3 {return new V3(this);}
	function clear() : V3 {return this.set(0, 0, 0);}

	function set(x:number, y:number, z:number) : V3 {
		this.x = x; this.y = y; this.z = z;
		return this;
	}
	function set(v:V3): V3 {this.set(v.x, v.y, v.z); return this;}
	function set(v:number[]) : V3 {this.set(v[0], v[1], v[2]); return this;}
	function set(v:Float32Array) : V3 {this.set(v[0], v[1], v[2]); return this;}

	function equals(v:V3) : boolean {
		return this.equals(v, MVQ.EQUAL_EPSILON);
	}
	function equals(v:V3, eps:number) : boolean {
		return
			Math.abs(v.x - this.x) < eps &&
			Math.abs(v.y - this.y) < eps &&
			Math.abs(v.z - this.z) < eps;
	}

	// this = this + v
	function add(x:number, y:number, z:number) : V3 {
		this.x += x; this.y += y; this.z += z;
		return this;
	}
	function add(v:V3): V3 {return this.add(v.x, v.y, v.z);}
	function add(v:number[]) : V3 {return this.add(v[0], v[1], v[2]);}
	function add(v:Float32Array) : V3 {return this.add(v[0], v[1], v[2]);}

	// this = this - v
	function sub(x:number, y:number, z:number) : V3 {
		this.x -= x; this.y -= y; this.z -= z;
		return this;
	}
	function sub(v:V3): V3 {return this.sub(v.x, v.y, v.z);}
	function sub(v:number[]) : V3 {return this.sub(v[0], v[1], v[2]);}
	function sub(v:Float32Array) : V3 {return this.sub(v[0], v[1], v[2]);}

	// this = this * v (for each element)
	function mul(x:number, y:number, z:number) : V3 {
		this.x *= x; this.y *= y; this.z *= z;
		return this;
	}
	function mul(v:V3): V3 {return this.mul(v.x, v.y, v.z);}
	function mul(v:number[]) : V3 {return this.mul(v[0], v[1], v[2]);}
	function mul(v:Float32Array) : V3 {return this.mul(v[0], v[1], v[2]);}

	// this = this * s
	function mul(s:number) : V3 {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	// this = -this
	function neg() : V3 {
		return this.mul(-1);
	}

	// this = normalize(this)
	function normalize() : V3 {
		var l = this.len();
		if (l > 0) {
			return this.mul(1 / l);
		} else {
			return this;
		}
	}

	// this = v0 x v1
	function cross(v0:V3, v1:V3) : V3 {
		var x0 = v0.x, y0 = v0.y, z0 = v0.z;
		var x1 = v1.x, y1 = v1.y, z1 = v1.z;
		this.x = y0 * z1 - z0 * y1;
		this.y = z0 * x1 - x0 * z1;
		this.z = x0 * y1 - y0 * x1;
		return this;
	}

	// return this . v
	function dot(v:V3) : number {
	    return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	// return len(this)
	function len() : number {
		return Math.sqrt(this.len2());
	}

	// return len(this)^2
	function len2() : number {
		var x = this.x, y = this.y, z = this.z;
		return x * x + y * y + z * z;
	}

	// return len(this - v)
	function dist(v:V3) : number {
		return Math.sqrt(this.dist2(v));
	}

	// return len(this - v)^2
	function dist2(v:V3) : number {
		var x = v.x - this.x;
		var y = v.y - this.y;
		var z = v.z - this.z;
		return x * x + y * y + z * z;
	}

	// this = (1 - ratio) * v0 + ratio *  v1
	function lerp(v0:V3, v1:V3, ratio:number) : V3 {
		this.x = v0.x + ratio * (v1.x - v0.x);
		this.y = v0.y + ratio * (v1.y - v0.y);
		this.z = v0.z + ratio * (v1.z - v0.z);
		return this;
	}

	// this = m * this
	function transformBy(m:M33) : V3 {
		var x = this.x, y = this.y, z = this.z;
		this.x = m.m11 * x + m.m12 * y + m.m13 * z;
		this.y = m.m21 * x + m.m22 * y + m.m23 * z;
		this.z = m.m31 * x + m.m32 * y + m.m33 * z;
		return this;
	}

	// this = m * this (affine transform)
	function transformBy(m:M44) : V3 {
		var x = this.x, y = this.y, z = this.z;
		this.x = m.m11 * x + m.m12 * y + m.m13 * z + m.m14;
		this.y = m.m21 * x + m.m22 * y + m.m23 * z + m.m24;
		this.z = m.m31 * x + m.m32 * y + m.m33 * z + m.m34;
		return this;
	}

	override function toString() : string {
		return "V3" + JSON.stringify(this.array());
	}
}

class V4 {
	// members
	var x = 0;
	var y = 0;
	var z = 0;
	var w = 0;

	// get as array
	function array() : number[] {return [this.x, this.y, this.z, this.w];}

	// constructors
	function constructor() {} // nop
	function constructor(v:V4) {this.set(v);} // copy constructor
	function constructor(v:number[]) {this.set(v);} // from array
	function constructor(v:Float32Array) {this.set(v);} // from typedarray
	function constructor(x:number, y:number, z:number, w:number) {this.set(x, y, z, w);} // from elements

	// dim conversion
	function constructor(v:V2, z:number, w:number) {this.set(v, z, w);}
	function constructor(v:V3, w:number) {this.set(v, w);}
	function V2() : V2 {return new V2(this);}
	function V3() : V3 {return new V3(this);}
	function set(v:V2, z:number, w:number): V4 {return this.set(v.x, v.y, z, w);}
	function set(v:V3, w:number): V4 {return this.set(v.x, v.y, v.z, w);}

	function clone() : V4 {return new V4(this);}
	function clear() : V4 {return this.set(0, 0, 0, 0);}

	function set(x:number, y:number, z:number, w:number) : V4 {
		this.x = x; this.y = y; this.z = z; this.w = w;
		return this;
	}
	function set(v:V4): V4 {this.set(v.x, v.y, v.z, v.w); return this;}
	function set(v:number[]) : V4 {this.set(v[0], v[1], v[2], v[3]); return this;}
	function set(v:Float32Array) : V4 {this.set(v[0], v[1], v[2], v[3]); return this;}

	function equals(v:V4) : boolean {
		return this.equals(v, MVQ.EQUAL_EPSILON);
	}
	function equals(v:V4, eps:number) : boolean {
		return
			Math.abs(v.x - this.x) < eps &&
			Math.abs(v.y - this.y) < eps &&
			Math.abs(v.z - this.z) < eps &&
			Math.abs(v.w - this.w) < eps;
	}

	// this = this + v
	function add(x:number, y:number, z:number, w:number) : V4 {
		this.x += x; this.y += y; this.z += z; this.w += w;
		return this;
	}
	function add(v:V4): V4 {return this.add(v.x, v.y, v.z, v.w);}
	function add(v:number[]) : V4 {return this.add(v[0], v[1], v[2], v[3]);}
	function add(v:Float32Array) : V4 {return this.add(v[0], v[1], v[2], v[3]);}

	// this = this - v
	function sub(x:number, y:number, z:number, w:number) : V4 {
		this.x -= x; this.y -= y; this.z -= z; this.w -= w;
		return this;
	}
	function sub(v:V4): V4 {return this.sub(v.x, v.y, v.z, v.w);}
	function sub(v:number[]) : V4 {return this.sub(v[0], v[1], v[2], v[3]);}
	function sub(v:Float32Array) : V4 {return this.sub(v[0], v[1], v[2], v[3]);}

	// this = this * v (for each element)
	function mul(x:number, y:number, z:number, w:number) : V4 {
		this.x *= x; this.y *= y; this.z *= z; this.w *= w;
		return this;
	}
	function mul(v:V4): V4 {return this.mul(v.x, v.y, v.z, v.w);}
	function mul(v:number[]) : V4 {return this.mul(v[0], v[1], v[2], v[3]);}
	function mul(v:Float32Array) : V4 {return this.mul(v[0], v[1], v[2], v[3]);}

	// this = this * s
	function mul(s:number) : V4 {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		this.w *= s;
		return this;
	}

	function neg() : V4 {
		return this.mul(-1);
	}

	function normalize() : V4 {
		var l = this.len();
		if (l > 0) {
			return this.mul(1 / l);
		} else {
			return this;
		}
	}

	function dot(v:V4) : number {
	    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
	}

	function len() : number {
		return Math.sqrt(this.len2());
	}

	function len2() : number {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		return x*x+y*y+z*z+w*w;
	}

	function dist(v:V4) : number {
		return Math.sqrt(this.dist2(v));
	}

	function dist2(v:V4) : number {
		var x = v.x - this.x;
		var y = v.y - this.y;
		var z = v.z - this.z;
		var w = v.w - this.w;
		return x*x+y*y+z*z+w*w;
	}

	function lerp(v0:V4, v1:V4, ratio:number) : V4 {
		this.x = v0.x + ratio * (v1.x - v0.x);
		this.y = v0.y + ratio * (v1.y - v0.y);
		this.z = v0.z + ratio * (v1.z - v0.z);
		this.w = v0.w + ratio * (v1.w - v0.w);
		return this;
	}

	function transformBy(m:M44) : V4 {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		this.x = m.m11 * x + m.m12 * y + m.m13 * z + m.m14 * w;
		this.y = m.m21 * x + m.m22 * y + m.m23 * z + m.m24 * w;
		this.z = m.m31 * x + m.m32 * y + m.m33 * z + m.m34 * w;
		this.w = m.m41 * x + m.m42 * y + m.m43 * z + m.m44 * w;
		return this;
	}

	override function toString() : string {
		return "V4" + JSON.stringify(this.array());
	}
}

class M22 {
	var m11 = 0;
	var m21 = 0;
	var m12 = 0;
	var m22 = 0;

	function array() : number[] {return [this.m11, this.m21, this.m12, this.m22];}
	function transposedArray() : number[] {return [this.m11, this.m12, this.m21, this.m22];}

	// constructors
	function constructor() {} // nop
	function constructor(m:M22) {this.set(m);} // copy constructor
	function constructor(m:number[]) {this.set(m);} // from array(column-major)
	function constructor(m:Float32Array) {this.set(m);} // from typedarray(column-major)
	function constructor( // from elements(CAUTION: row-major arguments order)
		m11:number, m12:number,
		m21:number, m22:number
	) {
		this.m11 = m11; this.m21 = m21; this.m12 = m12; this.m22 = m22;
	}
	function constructor(v0:V2, v1:V2) {this.set(v0,v1);} // from vectors
	function constructor(s:number) {this.set(s);} // scale matrix

	// dim conversion
	function constructor(m:M33) {this.set(m);}
	function constructor(m:M44) {this.set(m);}
	function M33(m22:number) : M33 {return new M33(this, m22);}
	function M44(m22:number, m33:number) : M44 {return new M44(this, m22, m33);}
	function set(m:M33) : M22 {
		this.m11 = m.m11; this.m21 = m.m21; this.m12 = m.m12; this.m22 = m.m22;
		return this;
	}
	function set(m:M44) : M22 {
		this.m11 = m.m11; this.m21 = m.m21; this.m12 = m.m12; this.m22 = m.m22;
		return this;
	}

	function clone() : M22 {return new M22(this);}

	function setZero() : M22 {return this.set(0);}
	function setIdentity() : M22 {return this.set(1);}
	static function zero() : M22 {return new M22().setZero();}
	static function identity() : M22 {return new M22().setIdentity();}

	function set( // (CAUTION: row-major parameters)
		m11:number, m12:number,
		m21:number, m22:number
	) : M22 {
		this.m11 = m11; this.m21 = m21; this.m12 = m12; this.m22 = m22;
		return this;
	}
	function set(v0:V2, v1:V2) : M22 {
		this.m11 = v0.x; this.m21 = v0.y;
		this.m12 = v1.x; this.m22 = v1.y;
		return this;
	}
	function set(m:M22): M22 {
		this.m11 = m.m11; this.m21 = m.m21; this.m12 = m.m12; this.m22 = m.m22;
		return this;
	}
	function set(m:number[]) : M22 {
		this.m11 = m[0]; this.m21 = m[1]; this.m12 = m[2]; this.m22 = m[3];
		return this;
	}
	function set(m:Float32Array) : M22 {
		this.m11 = m[0]; this.m21 = m[1]; this.m12 = m[2]; this.m22 = m[3];
		return this;
	}
	function set(s:number) : M22 {
		this.m11 = this.m22 = s;
		this.m21 = this.m12 = 0;
		return this;
	}

	function equals(m:M22) : boolean {
		return this.equals(m, MVQ.EQUAL_EPSILON);
	}
	function equals(m:M22, eps:number) : boolean {
		if (Math.abs(this.m11 - m.m11) >= eps) return false;
		if (Math.abs(this.m21 - m.m21) >= eps) return false;
		if (Math.abs(this.m12 - m.m12) >= eps) return false;
		if (Math.abs(this.m22 - m.m22) >= eps) return false;
		return true;
	}

	function add(m:M22) : M22 {
		this.m11 += m.m11; this.m21 += m.m21; this.m12 += m.m12; this.m22 += m.m22;
		return this;
	}
	function sub(m:M22) : M22 {
		this.m11 -= m.m11; this.m21 -= m.m21; this.m12 -= m.m12; this.m22 -= m.m22;
		return this;
	}
	function mul(m:M22) : M22 {
		return this.mul(this.clone(), m);
	}
	function mul(m0:M22, m1:M22) : M22 {
		this.m11 = m0.m11 * m1.m11 + m0.m12 * m1.m21;
		this.m21 = m0.m21 * m1.m11 + m0.m22 * m1.m21;
		this.m12 = m0.m11 * m1.m12 + m0.m12 * m1.m22;
		this.m22 = m0.m21 * m1.m12 + m0.m22 * m1.m22;
		return this;
	}

	function transpose() : M22 {
		var m12 = this.m12;
		this.m12 = this.m21;
		this.m21 = m12;
		return this;
	}
	function transpose(m:M22) : M22 {
		this.m11 = m.m11;
		this.m21 = m.m12;
		this.m12 = m.m21;
		this.m22 = m.m22;
		return this;
	}

	function det() : number {
		return this.m11 * this.m22 - this.m21 * this.m12;
	}

	function inverse() : M22 {
		var d = this.det();
		if (d == 0) return null;
		var invDet = 1 / d;
		var org = this.clone();
		this.m11 = org.m22 * invDet;
		this.m21 = -org.m21 * invDet;
		this.m12 = -org.m12 * invDet;
		this.m22 = org.m11 * invDet;
		return this;
	}

	function setScale(s:number) : M22 {return this.setScale(s, s);}
	function setScale(x:number, y:number) : M22 {
		this.m11 = x;
		this.m21 = this.m12 = 0;
		this.m22 = y;
		return this;
	}
	function setScale(v:V2) : M22 {return this.setScale(v.x, v.y);}
	function setScale(v:number[]) : M22 {return this.setScale(v[0], v[1]);}
	function setScale(v:Float32Array) : M22 {return this.setScale(v[0], v[1]);}

	function setRotation(rad:number) : M22 {
		var c = Math.cos(rad), s = Math.sin(rad);
		this.m11 = c;
		this.m21 = s;
		this.m12 = -s;
		this.m22 = c;
		return this;
	}

	override function toString() : string {
		return "M22" + JSON.stringify(this.array());
	}
}

class M33 {
	var m11 = 0; var m21 = 0; var m31 = 0;
	var m12 = 0; var m22 = 0; var m32 = 0;
	var m13 = 0; var m23 = 0; var m33 = 0;
	function array() : number[] {return [this.m11, this.m21, this.m31, this.m12, this.m22, this.m32, this.m13, this.m23, this.m33];}

	// constructors
	function constructor() {} // nop
	function constructor(m:M33) {this.set(m);} // copy constructor
	function constructor(m:number[]) {this.set(m);} // from array(column-major)
	function constructor(m:Float32Array) {this.set(m);} // from typedarray(column-major)
	function constructor( // from elements(CAUTION: row-major order parameters)
		m11:number, m12:number, m13:number,
		m21:number, m22:number, m23:number,
		m31:number, m32:number, m33:number
	) {
		this.m11 = m11; this.m21 = m21; this.m31 = m31;
		this.m12 = m12; this.m22 = m22; this.m32 = m32;
		this.m13 = m13; this.m23 = m23; this.m33 = m33;
	}
	function constructor(v0:V3, v1:V3, v2:V3) {this.set(v0,v1,v2);} // from vectors
	function constructor(s:number) {this.set(s);} // scale matrix

	// dim conversion
	function constructor(m:M22, m22:number) {this.set(m, m22);}
	function constructor(m:M44) {this.set(m);}
	function M22() : M22 {return new M22(this);}
	function M44(m33:number) : M44 {return new M44(this, m33);}
	function set(m:M22, m22:number) : M33 {
		this.m11 = m.m11; this.m21 = m.m21; this.m31 = 0;
		this.m12 = m.m12; this.m22 = m.m22; this.m32 = 0;
		this.m13 = 0; this.m23 = 0; this.m33 = 0;
		return this;
	}
	function set(m:M44) : M33 {
		this.m11 = m.m11; this.m21 = m.m21; this.m31 = m.m31;
		this.m12 = m.m12; this.m22 = m.m22; this.m32 = m.m32;
		this.m13 = m.m13; this.m23 = m.m23; this.m33 = m.m33;
		return this;
	}

	function clone() : M33 {return new M33(this);}

	function setZero() : M33 {return this.set(0);}
	function setIdentity() : M33 {return this.set(1);}
	static function zero() : M33 {return new M33().setZero();}
	static function identity() : M33 {return new M33().setIdentity();}

	function set( // (CAUTION: row-major order parameters)
		m11:number, m12:number, m13:number,
		m21:number, m22:number, m23:number,
		m31:number, m32:number, m33:number
	) : M33 {
		this.m11 = m11; this.m21 = m21; this.m31 = m31;
		this.m12 = m12; this.m22 = m22; this.m32 = m32;
		this.m13 = m13; this.m23 = m23; this.m33 = m33;
		return this;
	}
	function set(v0:V3, v1:V3, v2:V3) : M33 {
		this.m11 = v0.x; this.m21 = v0.y; this.m31 = v0.z;
		this.m12 = v1.x; this.m22 = v1.y; this.m32 = v1.z;
		this.m13 = v2.x; this.m23 = v2.y; this.m33 = v2.z;
		return this;
	}
	function set(m:M33): M33 {
		this.m11 = m.m11; this.m21 = m.m21; this.m31 = m.m31;
		this.m12 = m.m12; this.m22 = m.m22; this.m32 = m.m32;
		this.m13 = m.m13; this.m23 = m.m23; this.m33 = m.m33;
		return this;
	}
	function set(m:number[]) : M33 {
		this.m11 = m[0]; this.m21 = m[1]; this.m31 = m[2];
		this.m12 = m[3]; this.m22 = m[4]; this.m32 = m[5];
		this.m13 = m[6]; this.m23 = m[7]; this.m33 = m[8];
		return this;
	}
	function set(m:Float32Array) : M33 {
		this.m11 = m[0]; this.m21 = m[1]; this.m31 = m[2];
		this.m12 = m[3]; this.m22 = m[4]; this.m32 = m[5];
		this.m13 = m[6]; this.m23 = m[7]; this.m33 = m[8];
		return this;
	}
	function set(s:number) : M33 {
		this.m11 = this.m22 = this.m33 = s;
		this.m21 = this.m31 = this.m12 = this.m32 = this.m13 = this.m23 = 0;
		return this;
	}

	function equals(m:M33) : boolean {
		return this.equals(m, MVQ.EQUAL_EPSILON);
	}
	function equals(m:M33, eps:number) : boolean {
		if (Math.abs(this.m11 - m.m11) >= eps) return false;
		if (Math.abs(this.m21 - m.m21) >= eps) return false;
		if (Math.abs(this.m31 - m.m31) >= eps) return false;
		if (Math.abs(this.m12 - m.m12) >= eps) return false;
		if (Math.abs(this.m22 - m.m22) >= eps) return false;
		if (Math.abs(this.m32 - m.m32) >= eps) return false;
		if (Math.abs(this.m13 - m.m13) >= eps) return false;
		if (Math.abs(this.m23 - m.m23) >= eps) return false;
		if (Math.abs(this.m33 - m.m33) >= eps) return false;
		return true;
	}

	function add(m:M33) : M33 {
		this.m11 += m.m11; this.m21 += m.m21; this.m31 += m.m31;
		this.m12 += m.m12; this.m22 += m.m22; this.m32 += m.m32;
		this.m13 += m.m13; this.m23 += m.m23; this.m33 += m.m33;
		return this;
	}
	function sub(m:M33) : M33 {
		this.m11 -= m.m11; this.m21 -= m.m21; this.m31 -= m.m31;
		this.m12 -= m.m12; this.m22 -= m.m22; this.m32 -= m.m32;
		this.m13 -= m.m13; this.m23 -= m.m23; this.m33 -= m.m33;
		return this;
	}
	function mul(m:M33) : M33 {
		return this.mul(this.clone(), m);
	}
	function mul(m0:M33, m1:M33) : M33 {
		this.m11 = m0.m11*m1.m11 + m0.m12*m1.m21 + m0.m13*m1.m31;
		this.m21 = m0.m21*m1.m11 + m0.m22*m1.m21 + m0.m23*m1.m31;
		this.m31 = m0.m31*m1.m11 + m0.m32*m1.m21 + m0.m33*m1.m31;
		this.m12 = m0.m11*m1.m12 + m0.m12*m1.m22 + m0.m13*m1.m32;
		this.m22 = m0.m21*m1.m12 + m0.m22*m1.m22 + m0.m23*m1.m32;
		this.m32 = m0.m31*m1.m12 + m0.m32*m1.m22 + m0.m33*m1.m32;
		this.m13 = m0.m11*m1.m13 + m0.m12*m1.m23 + m0.m13*m1.m33;
		this.m23 = m0.m21*m1.m13 + m0.m22*m1.m23 + m0.m23*m1.m33;
		this.m33 = m0.m31*m1.m13 + m0.m32*m1.m23 + m0.m33*m1.m33;
		return this;
	}

	function transpose() : M33 {
		var m21 = this.m21, m31 = this.m31, m32 = this.m32;
		this.m21 = this.m12;
		this.m31 = this.m13;
		this.m32 = this.m23;
		this.m12 = m21;
		this.m13 = m31;
		this.m23 = m32;
		return this;
	}
	function transpose(m:M33) : M33 {
		this.m11 = m.m11;
		this.m21 = m.m12;
		this.m31 = m.m13;
		this.m12 = m.m21;
		this.m22 = m.m22;
		this.m32 = m.m23;
		this.m13 = m.m31;
		this.m23 = m.m32;
		this.m33 = m.m33;
		return this;
	}

	function det() : number {
		var m11 = this.m11, m12 = this.m12, m13 = this.m13;
		var m21 = this.m21, m22 = this.m22, m23 = this.m23;
		var m31 = this.m31, m32 = this.m32, m33 = this.m33;
		return m11 * (m22 * m33 - m23 * m32) + m12 * (m23 * m31 - m21 * m33) + m13 * (m21 * m32 - m22 * m31);
	}

	function inverse() : M33 {
		var d = this.det();
		if (d == 0) return null;
		var invDet = 1 / d;

		var m11 = this.m11, m21 = this.m21, m31 = this.m31;
		var m12 = this.m12, m22 = this.m22, m32 = this.m32;
		var m13 = this.m13, m23 = this.m23, m33 = this.m33;

		this.m11 = invDet * (m22 * m33 - m23 * m32);
		this.m21 = invDet * (m23 * m31 - m21 * m33);
		this.m31 = invDet * (m21 * m32 - m22 * m31);
		this.m12 = invDet * (m13 * m32 - m12 * m33);
		this.m22 = invDet * (m11 * m33 - m13 * m31);
		this.m32 = invDet * (m12 * m31 - m11 * m32);
		this.m13 = invDet * (m12 * m23 - m13 * m22);
		this.m23 = invDet * (m13 * m21 - m11 * m23);
		this.m33 = invDet * (m11 * m22 - m12 * m21);
		return this;
	}

	function setScale(s:number) : M33 {return this.set(s);}
	function setScale(x:number, y:number, z:number) : M33 {
		this.m11 = x;
		this.m22 = y;
		this.m33 = z;
		this.m21 = this.m31 = this.m12 = this.m32 = this.m13 = this.m23 = 0;
		return this;
	}
	function setScale(v:V3) : M33 {return this.setScale(v.x, v.y, v.z);}
	function setScale(v:number[]) : M33 {return this.setScale(v[0], v[1], v[2]);}
	function setScale(v:Float32Array) : M33 {return this.setScale(v[0], v[1], v[2]);}

	function setRotation(rad:number, x:number, y:number, z:number) : M33 {
		var l = Math.sqrt(x*x+y*y+z*z);
		if (l == 0) return null;
		var il = 1 / l;
		x *= il;
		y *= il;
		z *= il;
		var a = this.array();
		var c = Math.cos(rad), s = Math.sin(rad);
		var _c = 1-c;
		this.m11 = x*x*_c+c;
		this.m21 = y*x*_c+z*s;
		this.m31 = x*z*_c-y*s;
		this.m12 = x*y*_c-z*s;
		this.m22 = y*y*_c+c;
		this.m32 = y*z*_c+x*s;
		this.m13 = x*z*_c+y*s;
		this.m23 = y*z*_c-x*s;
		this.m33 = z*z*_c+c;
		return this;
	}
	function setRotation(rad:number, a:V3) : M33 {return this.setRotation(rad, a.x, a.y, a.z);}
	function setRotation(rad:number, a:number[]) : M33 {return this.setRotation(rad, this.m11, this.m21, this.m31);}
	function setRotation(rad:number, a:Float32Array) : M33 {return this.setRotation(rad, this.m11, this.m21, this.m31);}

	function setRotateX(rad:number) :M33 {return this.setRotation(rad, 1,0,0);}
	function setRotateY(rad:number) :M33 {return this.setRotation(rad, 0,1,0);}
	function setRotateZ(rad:number) :M33 {return this.setRotation(rad, 0,0,1);}

	override function toString() : string {
		return "M33" + JSON.stringify(this.array());
	}
}

class M44 {
	var m11 = 0; var m21 = 0; var m31 = 0; var m41 = 0;
	var m12 = 0; var m22 = 0; var m32 = 0; var m42 = 0;
	var m13 = 0; var m23 = 0; var m33 = 0; var m43 = 0;
	var m14 = 0; var m24 = 0; var m34 = 0; var m44 = 0;
	function array() : number[] {
		return [this.m11, this.m21, this.m31, this.m41,
		        this.m12, this.m22, this.m32, this.m42,
		        this.m13, this.m23, this.m33, this.m43,
		        this.m14, this.m24, this.m34, this.m44];
	}

	// constructors
	function constructor() {} // nop
	function constructor(m:M44) {this.set(m);} // copy constructor
	function constructor(m:number[]) {this.set(m);} // from array(column-major)
	function constructor(m:Float32Array) {this.set(m);} // from typedarray(column-major)
	function constructor( // from elements(CAUTION: row-major order parameters)
		m11:number, m12:number, m13:number, m14:number,
		m21:number, m22:number, m23:number, m24:number,
		m31:number, m32:number, m33:number, m34:number,
		m41:number, m42:number, m43:number, m44:number
	) {
		this.m11 = m11; this.m21 = m21; this.m31 = m31; this.m41 = m41;
		this.m12 = m12; this.m22 = m22; this.m32 = m32; this.m42 = m42;
		this.m13 = m13; this.m23 = m23; this.m33 = m33; this.m43 = m43;
		this.m14 = m14; this.m24 = m24; this.m34 = m34; this.m44 = m44;
	}
	function constructor(v0:V4, v1:V4, v2:V4, v3:V4) {this.set(v0,v1,v2,v3);} // from vectors
	function constructor(s:number) {this.set(s);} // scale matrix

	// dim conversion
	function constructor(m:M22, m22:number, m33:number) {this.set(m, m22, m33);}
	function constructor(m:M33, m33:number) {this.set(m, m33);}
	function M22() : M22 {return new M22(this);}
	function M33(m33:number) : M33 {return new M33(this);}
	function set(m:M22, m33:number, m44:number) : M44 {
		this.m11 = m.m11; this.m21 = m.m21; this.m31 = 0; this.m41 = 0;
		this.m12 = m.m12; this.m22 = m.m22; this.m32 = 0; this.m42 = 0;
		this.m13 = 0; this.m23 = 0; this.m33 = m33; this.m43 = 0;
		this.m14 = 0; this.m24 = 0; this.m34 = 0; this.m44 = m44;
		return this;
	}
	function set(m:M33, m44:number) : M44 {
		this.m11 = m.m11; this.m21 = m.m21; this.m31 = m.m31; this.m41 = 0;
		this.m12 = m.m12; this.m22 = m.m22; this.m32 = m.m32; this.m42 = 0;
		this.m13 = m.m13; this.m23 = m.m23; this.m33 = m.m33; this.m43 = 0;
		this.m14 = 0; this.m24 = 0; this.m34 = 0; this.m44 = m44;
		return this;
	}

	function clone() : M44 {return new M44(this);}

	function setZero() : M44 {return this.set(0);}
	function setIdentity() : M44 {return this.set(1);}
	static function zero() : M44 {return new M44().setZero();}
	static function identity() : M44 {return new M44().setIdentity();}

	function set( // (CAUTION: row-major order parameters)
		m11:number, m12:number, m13:number, m14:number,
		m21:number, m22:number, m23:number, m24:number,
		m31:number, m32:number, m33:number, m34:number,
		m41:number, m42:number, m43:number, m44:number
	) : M44 {
		this.m11 = m11; this.m21 = m21; this.m31 = m31; this.m41 = m41;
		this.m12 = m12; this.m22 = m22; this.m32 = m32; this.m42 = m42;
		this.m13 = m13; this.m23 = m23; this.m33 = m33; this.m43 = m43;
		this.m14 = m14; this.m24 = m24; this.m34 = m34; this.m44 = m44;
		return this;
	}
	function set(v1:V4, v2:V4, v3:V4, v4:V4) : M44 {
		this.m11 = v1.x; this.m21 = v1.y; this.m31 = v1.z; this.m41 = v1.w;
		this.m12 = v2.x; this.m22 = v2.y; this.m32 = v2.z; this.m42 = v2.w;
		this.m13 = v3.x; this.m23 = v3.y; this.m33 = v3.z; this.m43 = v3.w;
		this.m14 = v4.x; this.m24 = v4.y; this.m34 = v4.z; this.m44 = v4.w;
		return this;
	}
	function set(m:M44): M44 {
		this.m11 = m.m11; this.m21 = m.m21; this.m31 = m.m31; this.m41 = m.m41;
		this.m12 = m.m12; this.m22 = m.m22; this.m32 = m.m32; this.m42 = m.m42;
		this.m13 = m.m13; this.m23 = m.m23; this.m33 = m.m33; this.m43 = m.m43;
		this.m14 = m.m14; this.m24 = m.m24; this.m34 = m.m34; this.m44 = m.m44;
		return this;
	}
	function set(m:number[]) : M44 {
		this.m11 = m[0]; this.m21 = m[1]; this.m31 = m[2]; this.m41 = m[3];
		this.m12 = m[4]; this.m22 = m[5]; this.m32 = m[6]; this.m42 = m[7];
		this.m13 = m[8]; this.m23 = m[9]; this.m33 = m[10]; this.m43 = m[11];
		this.m14 = m[12]; this.m24 = m[13]; this.m34 = m[14]; this.m44 = m[15];
		return this;
	}
	function set(m:Float32Array) : M44 {
		this.m11 = m[0]; this.m21 = m[1]; this.m31 = m[2]; this.m41 = m[3];
		this.m12 = m[4]; this.m22 = m[5]; this.m32 = m[6]; this.m42 = m[7];
		this.m13 = m[8]; this.m23 = m[9]; this.m33 = m[10]; this.m43 = m[11];
		this.m14 = m[12]; this.m24 = m[13]; this.m34 = m[14]; this.m44 = m[15];
		return this;
	}
	function set(s:number) : M44 {
		this.m11 = this.m22 = this.m33 = this.m44 = s;
		this.m21 = this.m31 = this.m41 =
		this.m12 = this.m32 = this.m42 =
		this.m13 = this.m23 = this.m43 =
		this.m14 = this.m24 = this.m34 = 0;
		return this;
	}

	function equals(m:M44) : boolean {
		return this.equals(m, MVQ.EQUAL_EPSILON);
	}
	function equals(m:M44, eps:number) : boolean {
		if (Math.abs(this.m11 - m.m11) >= eps) return false;
		if (Math.abs(this.m21 - m.m21) >= eps) return false;
		if (Math.abs(this.m31 - m.m31) >= eps) return false;
		if (Math.abs(this.m41 - m.m41) >= eps) return false;
		if (Math.abs(this.m12 - m.m12) >= eps) return false;
		if (Math.abs(this.m22 - m.m22) >= eps) return false;
		if (Math.abs(this.m32 - m.m32) >= eps) return false;
		if (Math.abs(this.m42 - m.m42) >= eps) return false;
		if (Math.abs(this.m13 - m.m13) >= eps) return false;
		if (Math.abs(this.m23 - m.m23) >= eps) return false;
		if (Math.abs(this.m33 - m.m33) >= eps) return false;
		if (Math.abs(this.m43 - m.m43) >= eps) return false;
		if (Math.abs(this.m14 - m.m14) >= eps) return false;
		if (Math.abs(this.m24 - m.m24) >= eps) return false;
		if (Math.abs(this.m34 - m.m34) >= eps) return false;
		if (Math.abs(this.m44 - m.m44) >= eps) return false;
		return true;
	}

	function add(m:M44) : M44 {
		this.m11 += m.m11; this.m21 += m.m21; this.m31 += m.m31; this.m41 += m.m41;
		this.m12 += m.m12; this.m22 += m.m22; this.m32 += m.m32; this.m42 += m.m42;
		this.m13 += m.m13; this.m23 += m.m23; this.m33 += m.m33; this.m43 += m.m43;
		this.m14 += m.m14; this.m24 += m.m24; this.m34 += m.m34; this.m44 += m.m44;
		return this;
	}
	function sub(m:M44) : M44 {
		this.m11 -= m.m11; this.m21 -= m.m21; this.m31 -= m.m31; this.m41 -= m.m41;
		this.m12 -= m.m12; this.m22 -= m.m22; this.m32 -= m.m32; this.m42 -= m.m42;
		this.m13 -= m.m13; this.m23 -= m.m23; this.m33 -= m.m33; this.m43 -= m.m43;
		this.m14 -= m.m14; this.m24 -= m.m24; this.m34 -= m.m34; this.m44 -= m.m44;
		return this;
	}
	function mul(m:M44) : M44 {
		return this.mul(this.clone(), m);
	}
	function mul(m0:M44, m1:M44) : M44 {
		this.m11 = m0.m11*m1.m11 + m0.m12*m1.m21 + m0.m13*m1.m31 + m0.m14*m1.m41;
		this.m21 = m0.m21*m1.m11 + m0.m22*m1.m21 + m0.m23*m1.m31 + m0.m24*m1.m41;
		this.m31 = m0.m31*m1.m11 + m0.m32*m1.m21 + m0.m33*m1.m31 + m0.m34*m1.m41;
		this.m41 = m0.m41*m1.m11 + m0.m42*m1.m21 + m0.m43*m1.m31 + m0.m44*m1.m41;
		this.m12 = m0.m11*m1.m12 + m0.m12*m1.m22 + m0.m13*m1.m32 + m0.m14*m1.m42;
		this.m22 = m0.m21*m1.m12 + m0.m22*m1.m22 + m0.m23*m1.m32 + m0.m24*m1.m42;
		this.m32 = m0.m31*m1.m12 + m0.m32*m1.m22 + m0.m33*m1.m32 + m0.m34*m1.m42;
		this.m42 = m0.m41*m1.m12 + m0.m42*m1.m22 + m0.m43*m1.m32 + m0.m44*m1.m42;
		this.m13 = m0.m11*m1.m13 + m0.m12*m1.m23 + m0.m13*m1.m33 + m0.m14*m1.m43;
		this.m23 = m0.m21*m1.m13 + m0.m22*m1.m23 + m0.m23*m1.m33 + m0.m24*m1.m43;
		this.m33 = m0.m31*m1.m13 + m0.m32*m1.m23 + m0.m33*m1.m33 + m0.m34*m1.m43;
		this.m43 = m0.m41*m1.m13 + m0.m42*m1.m23 + m0.m43*m1.m33 + m0.m44*m1.m43;
		this.m14 = m0.m11*m1.m14 + m0.m12*m1.m24 + m0.m13*m1.m34 + m0.m14*m1.m44;
		this.m24 = m0.m21*m1.m14 + m0.m22*m1.m24 + m0.m23*m1.m34 + m0.m24*m1.m44;
		this.m34 = m0.m31*m1.m14 + m0.m32*m1.m24 + m0.m33*m1.m34 + m0.m34*m1.m44;
		this.m44 = m0.m41*m1.m14 + m0.m42*m1.m24 + m0.m43*m1.m34 + m0.m44*m1.m44;
		return this;
	}

	function transpose() : M44 {
		var m21 = this.m21, m31 = this.m31, m41 = this.m41, m32 = this.m32, m42 = this.m42, m43 = this.m43;
		this.m21 = this.m12;
		this.m31 = this.m13;
		this.m41 = this.m14;
		this.m12 = m21;
		this.m32 = this.m23;
		this.m42 = this.m24;
		this.m13 = m31;
		this.m23 = m32;
		this.m43 = this.m34;
		this.m14 = m41;
		this.m24 = m42;
		this.m34 = m43;
		return this;
	}
	function transpose(m:M44) : M44 {
		this.m11 = m.m11;
		this.m21 = m.m12;
		this.m31 = m.m13;
		this.m41 = m.m14;
		this.m12 = m.m21;
		this.m22 = m.m22;
		this.m32 = m.m23;
		this.m42 = m.m24;
		this.m13 = m.m31;
		this.m23 = m.m32;
		this.m33 = m.m33;
		this.m43 = m.m34;
		this.m14 = m.m41;
		this.m24 = m.m42;
		this.m34 = m.m43;
		this.m44 = m.m44;
		return this;
	}

	function det() : number {
		var m11 = this.m11, m21 = this.m21, m31 = this.m31, m41 = this.m41;
		var m12 = this.m12, m22 = this.m22, m32 = this.m32, m42 = this.m42;
		var m13 = this.m13, m23 = this.m23, m33 = this.m33, m43 = this.m43;
		var m14 = this.m14, m24 = this.m24, m34 = this.m34, m44 = this.m44;
		return
			m14 * m23 * m32 * m41 - m13 * m24 * m32 * m41 - m14 * m22 * m33 * m41 + m12 * m24 * m33 * m41 +
			m13 * m22 * m34 * m41 - m12 * m23 * m34 * m41 - m14 * m23 * m31 * m42 + m13 * m24 * m31 * m42 +
			m14 * m21 * m33 * m42 - m11 * m24 * m33 * m42 - m13 * m21 * m34 * m42 + m11 * m23 * m34 * m42 +
			m14 * m22 * m31 * m43 - m12 * m24 * m31 * m43 - m14 * m21 * m32 * m43 + m11 * m24 * m32 * m43 +
			m12 * m21 * m34 * m43 - m11 * m22 * m34 * m43 - m13 * m22 * m31 * m44 + m12 * m23 * m31 * m44 +
			m13 * m21 * m32 * m44 - m11 * m23 * m32 * m44 - m12 * m21 * m33 * m44 + m11 * m22 * m33 * m44;
	}

	function inverse() : M44 {
		var
			m11 = this.m11, m21 = this.m21, m31 = this.m31, m41 = this.m41,
			m12 = this.m12, m22 = this.m22, m32 = this.m32, m42 = this.m42,
			m13 = this.m13, m23 = this.m23, m33 = this.m33, m43 = this.m43,
			m14 = this.m14, m24 = this.m24, m34 = this.m34, m44 = this.m44;
		var
			b00 = m11 * m22 - m21 * m12,
			b01 = m11 * m32 - m31 * m12,
			b02 = m11 * m42 - m41 * m12,
			b03 = m21 * m32 - m31 * m22,
			b04 = m21 * m42 - m41 * m22,
			b05 = m31 * m42 - m41 * m32,
			b06 = m13 * m24 - m23 * m14,
			b07 = m13 * m34 - m33 * m14,
			b08 = m13 * m44 - m43 * m14,
			b09 = m23 * m34 - m33 * m24,
			b10 = m23 * m44 - m43 * m24,
			b11 = m33 * m44 - m43 * m34;

		var d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
		if (d == 0) return null;

		var invDet = 1 / d;

		this.m11 = ( m22 * b11 - m32 * b10 + m42 * b09) * invDet;
		this.m21 = (-m21 * b11 + m31 * b10 - m41 * b09) * invDet;
		this.m31 = ( m24 * b05 - m34 * b04 + m44 * b03) * invDet;
		this.m41 = (-m23 * b05 + m33 * b04 - m43 * b03) * invDet;
		this.m12 = (-m12 * b11 + m32 * b08 - m42 * b07) * invDet;
		this.m22 = ( m11 * b11 - m31 * b08 + m41 * b07) * invDet;
		this.m32 = (-m14 * b05 + m34 * b02 - m44 * b01) * invDet;
		this.m42 = ( m13 * b05 - m33 * b02 + m43 * b01) * invDet;
		this.m13 = ( m12 * b10 - m22 * b08 + m42 * b06) * invDet;
		this.m23 = (-m11 * b10 + m21 * b08 - m41 * b06) * invDet;
		this.m33 = ( m14 * b04 - m24 * b02 + m44 * b00) * invDet;
		this.m43 = (-m13 * b04 + m23 * b02 - m43 * b00) * invDet;
		this.m14 = (-m12 * b09 + m22 * b07 - m32 * b06) * invDet;
		this.m24 = ( m11 * b09 - m21 * b07 + m31 * b06) * invDet;
		this.m34 = (-m14 * b03 + m24 * b01 - m34 * b00) * invDet;
		this.m44 = ( m13 * b03 - m23 * b01 + m33 * b00) * invDet;

		return this;
	}

	function setTranslation(x:number, y:number, z:number) : M44 {
		this.setIdentity();
		this.m14 = x;
		this.m24 = y;
		this.m34 = z;
		return this;
	}
	function setTranslation(v:V3) : M44 {return this.setTranslation(v.x, v.y, v.z);}
	function setTranslation(v:number[]) : M44 {return this.setTranslation(v[0], v[1], v[2]);}
	function setTranslation(v:Float32Array) : M44 {return this.setTranslation(v[0], v[1], v[2]);}
	static function translation(x:number, y:number, z:number) : M44 {return new M44().setTranslation(x, y, z);}
	static function translation(v:V3) : M44 {return new M44().setTranslation(v);}
	static function translation(v:number[]) : M44 {return new M44().setTranslation(v);}
	static function translation(v:Float32Array) : M44 {return new M44().setTranslation(v);}

	function setScale(s:number) : M44 {return this.setScale(s, s, s);}
	function setScale(x:number, y:number, z:number) : M44 {
		this.setZero();
		this.m11 = x;
		this.m22 = y;
		this.m33 = z;
		this.m44 = 1;
		return this;
	}
	function setScale(v:V3) : M44 {return this.setScale(v.x, v.y, v.z);}
	function setScale(v:number[]) : M44 {return this.setScale(v[0], v[1], v[2]);}
	function setScale(v:Float32Array) : M44 {return this.setScale(v[0], v[1], v[2]);}
	static function scale(x:number, y:number, z:number) : M44 {return new M44().setScale(x, y, z);}
	static function scale(v:V3) : M44 {return new M44().setScale(v);}
	static function scale(v:number[]) : M44 {return new M44().setScale(v);}
	static function scale(v:Float32Array) : M44 {return new M44().setScale(v);}

	function setRotation(rad:number, x:number, y:number, z:number) : M44 {
		var l = Math.sqrt(x*x+y*y+z*z);
		if (l == 0) return null;
		var il = 1 / l;
		x *= il;
		y *= il;
		z *= il;
		var a = this.array();
		var c = Math.cos(rad), s = Math.sin(rad);
		var _c = 1-c;
		this.m11 = x*x*_c+c;
		this.m21 = y*x*_c+z*s;
		this.m31 = x*z*_c-y*s;
		this.m12 = x*y*_c-z*s;
		this.m22 = y*y*_c+c;
		this.m32 = y*z*_c+x*s;
		this.m13 = x*z*_c+y*s;
		this.m23 = y*z*_c-x*s;
		this.m33 = z*z*_c+c;
		this.m41 = this.m42 = this.m43 = this.m14 = this.m24 = this.m34= 0;
		this.m44 = 1;
		return this;
	}
	function setRotation(rad:number, a:V3) : M44 {return this.setRotation(rad, a.x, a.y, a.z);}
	function setRotation(rad:number, a:number[]) : M44 {return this.setRotation(rad, this.m11, this.m21, this.m31);}
	function setRotation(rad:number, a:Float32Array) : M44 {return this.setRotation(rad, this.m11, this.m21, this.m31);}
	static function rotation(rad:number, ax:number, ay:number, az:number) : M44 {return new M44().setRotation(rad, ax, ay, az);}
	static function rotation(rad:number, axis:V3) : M44 {return new M44().setRotation(rad, axis);}
	static function rotation(rad:number, axis:number[]) : M44 {return new M44().setRotation(rad, axis);}
	static function rotation(rad:number, axis:Float32Array) : M44 {return new M44().setRotation(rad, axis);}

	function setRotationX(rad:number) : M44 {return this.setRotation(rad, 1,0,0);}
	function setRotationY(rad:number) : M44 {return this.setRotation(rad, 0,1,0);}
	function setRotationZ(rad:number) : M44 {return this.setRotation(rad, 0,0,1);}
	static function rotationX(rad:number) : M44 {return new M44().setRotationX(rad);}
	static function rotationY(rad:number) : M44 {return new M44().setRotationY(rad);}
	static function rotationZ(rad:number) : M44 {return new M44().setRotationZ(rad);}

	function setFrustum(l:number, r:number, b:number, t:number, n:number, f:number) : M44 {
		var a = this.array();
		var rl = r-l, tb = t-b, fn = f-n;
		this.m11 = 2 * n / rl;
		this.m22 = 2 * n / tb;
		this.m13 = (r+l) / rl;
		this.m23 = (t+b) / tb;
		this.m33 = -(f+n) / fn;
		this.m43 = -1;
		this.m34 = -2*f*n / fn;
		this.m21 = this.m31 = this.m41 = this.m12 = this.m32 = this.m42 = this.m14 = this.m24 = this.m44 = 0;
		return this;
	}
	static function frustum(l:number, r:number, b:number, t:number, n:number, f:number) : M44 {return new M44().setFrustum(l,r,b,t,n,f);}

	function setOrtho(l:number, r:number, b:number, t:number, n:number, f:number) : M44 {
		var a = this.array();
		var rl = r-l, tb = t-b, fn = f-n;
		this.m11 = 2 / rl;
		this.m22 = 2 / tb;
		this.m33 = -2 / fn;
		this.m14 = -(r+l) / rl;
		this.m24 = -(t+b) / tb;
		this.m34 = -(f+n) / fn;
		this.m21 = this.m31 = this.m41 = this.m12 = this.m32 = this.m42 = this.m13 = this.m23 = this.m43 = 0;
		this.m44 = 1;
		return this;
	}
	static function ortho(l:number, r:number, b:number, t:number, n:number, f:number) : M44 {return new M44().setOrtho(l,r,b,t,n,f);}

	override function toString() : string {
		return "M44" + JSON.stringify(this.array());
	}
}

class Quat {
	var w = 0;
	var x = 0;
	var y = 0;
	var z = 0;
	function array() : number[] {return [this.w, this.x, this.y, this.z];}

	// constructors
	function constructor() {} // nop
	function constructor(q:Quat) {this.set(q);} // copy constructor
	function constructor(q:number[]) {this.set(q);} // from array (q[0] + q[1]i + q[2]j + q[3]k)
	function constructor(q:Float32Array) {this.set(q);} // from typedarray (q[0] + q[1]i + q[2]j + q[3]k)
	function constructor(w:number, x:number, y:number, z:number) {this.set(w,x,y,z);}  // from elements (w + xi + yj + zk)

	function clone() : Quat {return new Quat(this);}

	function setZero() : Quat {return this.set(0, 0, 0, 0);}
	function setIdentity() : Quat {return this.set(1, 0, 0, 0);}
	static function zero() : Quat {return new Quat().setZero();}
	static function identity() : Quat {return new Quat().setIdentity();}

	function set(w:number, x:number, y:number, z:number) : Quat {
		this.w = w; this.x = x; this.y = y; this.z = z;
		return this;
	}
	function set(q:Quat) : Quat {
		this.w = q.w; this.x = q.x; this.y = q.y; this.z = q.z;
		return this;
	}
	function set(q:number[]) : Quat {
		this.w = q[0]; this.x = q[1]; this.y = q[2]; this.z = q[3];
		return this;
	}
	function set(q:Float32Array) : Quat {
		this.w = q[0]; this.x = q[1]; this.y = q[2]; this.z = q[3];
		return this;
	}
	function set(w:number, v:V3): Quat {
		this.w = w; this.x = v.x; this.y = v.y; this.z = v.z;
		return this;
	}

	function equals(q:Quat) : boolean {
		return this.equals(q, MVQ.EQUAL_EPSILON);
	}
	function equals(q:Quat, eps:number) : boolean {
		if (Math.abs(this.w - q.w) >= eps) return false;
		if (Math.abs(this.x - q.x) >= eps) return false;
		if (Math.abs(this.y - q.y) >= eps) return false;
		if (Math.abs(this.z - q.z) >= eps) return false;
		return true;
	}

	function dot(q:Quat) : number {
		return this.w*q.w + this.x*q.x + this.y*q.y + this.z*q.z;
	}

	function inverse() : Quat {
		var q0 = this.w, q1 = this.x, q2 = this.y, q3 = this.z;
		var dot = q0*q0 + q1*q1 + q2*q2 + q3*q3;
		if (dot == 0) return null;
		var invDot = 1 / dot;
		this.w *= invDot;
		this.x *= -invDot;
		this.y *= -invDot;
		this.z *= -invDot;
		return this;
	}

	function conjugate() : Quat {
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
		return this;
	}

	function len() : number {
		return Math.sqrt(this.len2());
	}

	function len2() : number {
		var w = this.w, x = this.x, y = this.y, z = this.z;
		return w*w + x*x + y*y + z*z;
	}

	function normalize() : Quat {
		var w = this.w, x = this.x, y = this.y, z = this.z;
		var l = Math.sqrt(x * x + y * y + z * z + w * w);
		if (l == 0) return null;
		var il = 1 / l;
		this.w *= il;
		this.x *= il;
		this.y *= il;
		this.z *= il;
		return this;
	}

	function add(q:Quat) : Quat {
		this.w += q.w;
		this.x += q.x;
		this.y += q.y;
		this.z += q.z;
		return this;
	}
	function sub(q:Quat) : Quat {
		this.w -= q.w;
		this.x -= q.x;
		this.y -= q.y;
		this.z -= q.z;
		return this;
	}
	function mul(q:Quat) : Quat {
		var  aw = this.w, ax = this.x, ay = this.y, az = this.z;
		var  bw = q.w, bx = q.x, by = q.y, bz = q.z;
		this.w = aw * bw - ax * bx - ay * by - az * bz;
		this.x = aw * bx + ax * bw + ay * bz - az * by;
		this.y = aw * by - ax * bz + ay * bw + az * bx;
		this.z = aw * bz + ax * by - ay * bx + az * bw;
		return this;
	}
	function mul(s:number) : Quat {
		this.w *= s;
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	function slerp(q0:Quat, q1:Quat, slerp:number) : Quat {
		var  aw = q0.w, ax = q0.x, ay = q0.y, az = q0.z;
		var  bw = q1.w, bx = q1.x, by = q1.y, bz = q1.z;

		var cosHalfTheta = aw*bw + ax*bx + ay*by + az*bz;
		if (Math.abs(cosHalfTheta) >= 1.0) return this;

		var halfTheta = Math.acos(cosHalfTheta);
		var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

		if (Math.abs(sinHalfTheta) < 0.001) {
			this.w = (aw + bw) / 2;
			this.x = (ax + bx) / 2;
			this.y = (ay + by) / 2;
			this.z = (az + bz) / 2;
			return this;
		}

		var ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
		var ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;

		this.w = (aw * ratioA + bw * ratioB);
		this.x = (ax * ratioA + bx * ratioB);
		this.y = (ay * ratioA + by * ratioB);
		this.z = (az * ratioA + bz * ratioB);

		return this;
	}

	override function toString() : string {
		return "Quat" + JSON.stringify(this.array());
	}
}

class _Main {
	static function main(args:string[]) : void {
	}
}


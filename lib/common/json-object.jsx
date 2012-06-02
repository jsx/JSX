/**

Type safe JSON manipulator

*/

class JSONObject {
	static const NULL : JSONObject = null;

	static function quote(str : string) : string {
		return JSON.stringify(str);
	}

	var _object : Map.<variant>;

	function constructor() {
		this._object = new Map.<variant>();
	}

	function constructor(source : string) {
		var value = JSON.parse(source);
		if(value as Array.<variant> != null) {
			throw new TypeError("JSON source is not an object");
		}

		var object = value as Map.<variant>;
		if(object == null) {
			throw new TypeError("JSON source is not an object");
		}
		this._object = object;
	}

	// wrap a map
	function constructor(source : Map.<variant>) {
		this._object = source;
	}

	function isNull(key : string) : boolean {
		var value = this.get(key);
		return value == undefined || value == null;
	}

	function get(key : string) : variant {
		return this._object[key];
	}

	function getBoolean(key : string) : boolean {
		var v = this.get(key);
		if(typeof v == "object") {
			throw new TypeError("JSONObject["+JSONObject.quote(key)+"] is not a bool");
		}
		return v as boolean;
	}

	function getNumber(key : string) : number {
		var v = this.get(key);
		if(typeof v == "object") {
			throw new TypeError("JSONObject["+JSONObject.quote(key)+"] is not a number");
		}
		return v as number;
	}

	function getInt(key : string) : int {
		var v = this.get(key);
		if(typeof v == "object") {
			throw new TypeError("JSONObject["+JSONObject.quote(key)+"] is not an integer");
		}
		return v as int;
	}

	function getString(key : string) : string {
		var v = this.get(key);
		if(typeof v == "object") {
			throw new TypeError("JSONObject["+JSONObject.quote(key)+"] is not a string");
		}
		return v as string;
	}

	function getJSONArray(key : string) : JSONArray {
		var value = this.get(key) as Array.<variant>;
		if(value == null) {
			throw new TypeError("JSONObject["+JSONObject.quote(key)+"] is not an array");
		}
		return new JSONArray(value);
	}

	function getJSONObject(key : string) : JSONObject {
		var value = this.get(key);
		if(value as Array.<variant> != null) {
			throw new TypeError("JSONObject["+JSONObject.quote(key)+"] is not an object but an array");
		}

		var object = value as Map.<variant>;
		if(object == null) {
			throw new TypeError("JSONObject["+JSONObject.quote(key)+"] is not an object ");
		}
		return new JSONObject(object);
	}

	function put(key : string, value : variant) : void {
		this._object[key] = value;
	}
	function put(key : string, value : JSONObject) : void {
		this._object[key] = value != null
			? value._object
			: null as Map.<variant>;
	}
	function put(key : string, value : JSONArray) : void {
		this._object[key] = value != null
			? value._array
			: null as Array.<variant>;
	}

	function remove(key : string) : void {
		delete this._object[key];
	}

	function has(key : string) : boolean {
		return this._object.hasOwnProperty(key);
	}

	function keys() : string[] {
		var k = new Array.<string>();
		for(var key in this._object) {
			k.push(key);
		}
		return k;
	}

	override function toString() : string {
		return JSON.stringify(this._object);
	}

	function toString(indent : int) : string {
		return JSON.stringify(this._object, null, indent);
	}
}

class JSONArray {
	var _array : Array.<variant>;

	function constructor() {
		this._array = new Array.<variant>();
	}
	function constructor(source : string) {
		var value = JSON.parse(source) as Array.<variant>;
		if(value == null) {
			throw new TypeError("JSON source is not an array");
		}
		this._array = value;
	}

	// wrap an array
	function constructor(source : Array.<variant>) {
		this._array = source;
	}

	function isNull(key : int) : boolean {
		var value = this.get(key);
		return value == undefined || value == null;
	}

	function get(key : int) : variant {
		return this._array[key];
	}

	function getBoolean(key : int) : boolean {
		var v = this.get(key);
		if(typeof v == "object") {
			throw new TypeError("JSONArray[" + key as string + "] is not a bool");
		}
		return v as boolean;
	}

	function getNumber(key : int) : number {
		var v = this.get(key);
		if(typeof v == "object") {
			throw new TypeError("JSONArray["+ key as string +"] is not a number");
		}
		return v as number;
	}

	function getInt(key : int) : int {
		var v = this.get(key);
		if(typeof v == "object") {
			throw new TypeError("JSONArray["+ key as string +"] is not a number");
		}
		return v as int;
	}

	function getString(key : int) : string {
		var v = this.get(key);
		if(typeof v == "object") {
			throw new TypeError("JSONArray["+ key as string +"] is not a string");
		}
		return v as string;
	}

	function getJSONArray(key : int) : JSONArray {
		var value = this.get(key) as Array.<variant>;
		if(value == null) {
			throw new TypeError("JSONArray["+ key as string +"] is not an array");
		}
		return new JSONArray(value);
	}

	function getJSONObject(key : int) : JSONObject {
		var value = this.get(key);
		if(value as Array.<variant> != null) {
			throw new TypeError("JSONArray["+ key as string +"] is not an object but an array");
		}

		var object = value as Map.<variant>;
		if(object == null) {
			throw new TypeError("JSONArray["+ key as string +"] is not an object");
		}
		return new JSONObject(object);
	}

	function put(key : int, value : variant) : void {
		this._array[key] = value;
	}
	function put(key : int, value : JSONObject) : void {
		this._array[key] = value != null
			? value._object
			: null as Map.<variant>;
	}
	function put(key : int, value : JSONArray) : void {
		this._array[key] = value != null
			? value._array
			: null as Array.<variant>;
	}

	function push(value : variant) : void {
		var a = this._array;
		a[a.length] = value;
	}
	function push(value : JSONObject) : void {
		var a = this._array;
		a[a.length] = value._object;
	}
	function push(value : JSONArray) : void {
		var a = this._array;
		a[a.length] = value._array;
	}

	function remove(key : int) : void {
		this._array.splice(key, 1);;
	}

	function getLength() : int {
		return this._array.length;
	}

	override function toString() : string {
		return JSON.stringify(this._array);
	}

	function toString(indent : int) : string {
		return JSON.stringify(this._array, null, indent);
	}
}

class _Main {
	static function main(args : string[]) : void {
		args.forEach(function(v : MayBeUndefined.<string>) : void {
			log new JSONObject(v).toString(2);
		});
	}
}

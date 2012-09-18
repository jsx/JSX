/*EXPECTED
true
true
true
true
true
false
false
false
1.5
false
3
false
abc
*/
class _Main {
	static function main(args : string[]) : void {
		var a : variant = null;
		log (a as __noconvert__ Nullable.<boolean>) == null;
		log (a as __noconvert__ Nullable.<number>) == null;
		log (a as __noconvert__ Nullable.<int>) == null;
		log (a as __noconvert__ Nullable.<string>) == null;
		a = false;
		log (a as __noconvert__ Nullable.<boolean>) == false;
		log (a as __noconvert__ Nullable.<boolean>) == null;
		log (a as __noconvert__ Nullable.<boolean>) == true;
		a = 1.5;
		log (a as __noconvert__ Nullable.<number>) == null;
		var n : number = a as __noconvert__ Nullable.<number>;
		log n;
		a = 3;
		log (a as __noconvert__ Nullable.<int>) == null;
		var i : int = a as __noconvert__ Nullable.<int>;
		log i;
		a = "abc";
		log (a as __noconvert__ Nullable.<string>) == null;
		var s : string = a as __noconvert__ Nullable.<string>;
		log s;
	}
}

/*EXPECTED
3
true
false
true
true
false
true
*/
class Test {
	static function run() : void {
		var a = [ null, 3 ] : Array.<variant>;
		log a[1];
		log a[0] == null;
		log a[1] == null;
		log a[2] == null;
		log a.shift() == null;
		log a.shift() == null;
		log a.shift() == null;
	}
}

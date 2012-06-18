/*EXPECTED
["f","n"]
*/
/*JSX_OPTS
--complete 16:5
*/

class A {
	var n = 1;
	static var s = "abc";
	function f() : void {}
}
class B {
	static function f() : void {
		var a = new A;
		a.

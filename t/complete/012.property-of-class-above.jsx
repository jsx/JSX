class A {
	var n = 1;
	static var s = "abc";
	function f() : void {}
}
class B {
	static function f() : void {
		var a = new A;
		a.
/*EXPECTED
[
   {
      "word" : "n",
      "definedClass" : "A",
      "type" : "number"
   },
   {
      "word" : "f",
      "definedClass" : "A",
      "args" : [],
      "returnType" : "void",
      "type" : "A.function () : void"
   },
   {
      "word" : "toString",
      "definedClass" : "Object",
      "args" : [],
      "returnType" : "string",
      "type" : "Object.function () : string"
   }
]
*/
/*JSX_OPTS
--complete 9:5
*/


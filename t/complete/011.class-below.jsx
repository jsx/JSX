class A {
	function constructor() {
		B.
	}
}
class B {
	static var n : number;
}
/*EXPECTED
[
   {
      "word" : "<"
   },
   {
      "word" : "n",
      "definedClass" : "B",
      "type" : "number"
   }
]
*/
/*JSX_OPTS
--complete 3:5
*/


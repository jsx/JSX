class T {
	static function f() : void {
		t
/*EXPECTED
[
   {
      "word" : "throw",
      "partialWord" : "hrow"
   },
   {
      "word" : "try",
      "partialWord" : "ry"
   },
   {
      "word" : "true",
      "partialWord" : "rue"
   },
   {
      "word" : "typeof",
      "partialWord" : "ypeof"
   }
]
*/
/*JSX_OPTS
--complete 3:4
*/

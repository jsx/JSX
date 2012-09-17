class T {
	function constructor() {
		t
/*EXPECTED
[
   {
      "word" : "this",
      "partialWord" : "his"
   },
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

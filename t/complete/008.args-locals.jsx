class T {
	function constructor(a1 : number, a2 : number) {
		var a3;
		a
/*EXPECTED
[
   {
      "word" : "assert",
      "partialWord" : "ssert"
   },
   {
      "word" : "a3",
      "partialWord" : "3"
   },
   {
      "word" : "a1",
      "partialWord" : "1",
      "type" : "number"
   },
   {
      "word" : "a2",
      "partialWord" : "2",
      "type" : "number"
   }
]
*/
/*JSX_OPTS
--complete 4:4
*/

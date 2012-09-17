class A {
	static var pi = M
/*EXPECTED
[
   {
      "word" : "Math",
      "partialWord" : "ath"
   },
   {
      "word" : "Map",
      "partialWord" : "ap"
   }
]
*/
/*JSX_OPTS
--complete 2:19
*/

class A {
}
class B extends
/*EXPECTED
[
   {
      "word" : "A"
   },
   {
      "word" : "Object"
   },
   {
      "word" : "Error"
   },
   {
      "word" : "EvalError"
   },
   {
      "word" : "RangeError"
   },
   {
      "word" : "ReferenceError"
   },
   {
      "word" : "SyntaxError"
   },
   {
      "word" : "TypeError"
   },
   {
      "word" : "g_StopIteration"
   }
]
*/
/*JSX_OPTS
--complete 4:1
*/

class C {
}
interface II {
}
interface JJ {
}
class B implements I
/*EXPECTED
[
   {
      "word" : "II",
      "partialWord" : "I"
   }
]
*/
/*JSX_OPTS
--complete 7:21
*/

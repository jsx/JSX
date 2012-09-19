class C extends String /* this is the error */ {
	static function f() : void {
		"abc".substring(0).c
/*EXPECTED
[
   {
      "word" : "charAt",
      "partialWord" : "harAt",
      "definedClass" : "String",
      "args" : [
         {
            "name" : "pos",
            "type" : "number"
         }
      ],
      "returnType" : "string",
      "type" : "String.function (: number) : string"
   },
   {
      "word" : "charCodeAt",
      "partialWord" : "harCodeAt",
      "definedClass" : "String",
      "args" : [
         {
            "name" : "pos",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "String.function (: number) : number"
   },
   {
      "word" : "concat",
      "partialWord" : "oncat",
      "definedClass" : "String",
      "args" : [
         {
            "name" : "stringN",
            "type" : "...string"
         }
      ],
      "returnType" : "string",
      "type" : "String.function (... : string) : string"
   }
]
*/
/*JSX_OPTS
--complete 3:23
*/


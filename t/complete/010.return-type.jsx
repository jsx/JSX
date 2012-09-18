class T {
	static function f() : void {
		"abc".substring(0).toLo
/*EXPECTED
[
   {
      "word" : "toLowerCase",
      "partialWord" : "werCase",
      "definedClass" : "String",
      "args" : [],
      "returnType" : "string",
      "type" : "String.function () : string"
   },
   {
      "word" : "toLocaleLowerCase",
      "partialWord" : "caleLowerCase",
      "definedClass" : "String",
      "args" : [],
      "returnType" : "string",
      "type" : "String.function () : string"
   },
   {
      "word" : "toLocaleUpperCase",
      "partialWord" : "caleUpperCase",
      "definedClass" : "String",
      "args" : [],
      "returnType" : "string",
      "type" : "String.function () : string"
   }
]
*/
/*JSX_OPTS
--complete 3:26
*/

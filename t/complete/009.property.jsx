class T {
	static function f() : void {
		"abc".t
/*EXPECTED
[
   {
      "word" : "toString",
      "partialWord" : "oString",
      "definedClass" : "String",
      "args" : [],
      "returnType" : "string",
      "type" : "String.function () : string"
   },
   {
      "word" : "toLowerCase",
      "partialWord" : "oLowerCase",
      "definedClass" : "String",
      "args" : [],
      "returnType" : "string",
      "type" : "String.function () : string"
   },
   {
      "word" : "toLocaleLowerCase",
      "partialWord" : "oLocaleLowerCase",
      "definedClass" : "String",
      "args" : [],
      "returnType" : "string",
      "type" : "String.function () : string"
   },
   {
      "word" : "toUpperCase",
      "partialWord" : "oUpperCase",
      "definedClass" : "String",
      "args" : [],
      "returnType" : "string",
      "type" : "String.function () : string"
   },
   {
      "word" : "toLocaleUpperCase",
      "partialWord" : "oLocaleUpperCase",
      "definedClass" : "String",
      "args" : [],
      "returnType" : "string",
      "type" : "String.function () : string"
   },
   {
      "word" : "trim",
      "partialWord" : "rim",
      "definedClass" : "String",
      "args" : [],
      "returnType" : "string",
      "type" : "String.function () : string"
   }
]
*/
/*JSX_OPTS
--complete 3:10
*/

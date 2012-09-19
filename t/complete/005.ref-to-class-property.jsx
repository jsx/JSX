class A {
	static var pi = Math.
/*EXPECTED
[
   {
      "word" : "<"
   },
   {
      "word" : "E",
      "definedClass" : "Math",
      "type" : "number"
   },
   {
      "word" : "LN10",
      "definedClass" : "Math",
      "type" : "number"
   },
   {
      "word" : "LN2",
      "definedClass" : "Math",
      "type" : "number"
   },
   {
      "word" : "LOG2E",
      "definedClass" : "Math",
      "type" : "number"
   },
   {
      "word" : "LOG10E",
      "definedClass" : "Math",
      "type" : "number"
   },
   {
      "word" : "PI",
      "definedClass" : "Math",
      "type" : "number"
   },
   {
      "word" : "SQRT1_2",
      "definedClass" : "Math",
      "type" : "number"
   },
   {
      "word" : "SQRT2",
      "definedClass" : "Math",
      "type" : "number"
   },
   {
      "word" : "abs",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "acos",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "asin",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "atan",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "atan2",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "y",
            "type" : "number"
         },
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number, : number) : number"
   },
   {
      "word" : "ceil",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "cos",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "exp",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "floor",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "log",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "max",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "value1",
            "type" : "number"
         },
         {
            "name" : "value2",
            "type" : "number"
         },
         {
            "name" : "value3",
            "type" : "number"
         },
         {
            "name" : "valueN",
            "type" : "...number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number, : number, : number, ... : number) : number"
   },
   {
      "word" : "max",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "value1",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "min",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "value1",
            "type" : "number"
         },
         {
            "name" : "value2",
            "type" : "number"
         },
         {
            "name" : "value3",
            "type" : "number"
         },
         {
            "name" : "valueN",
            "type" : "...number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number, : number, : number, ... : number) : number"
   },
   {
      "word" : "min",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "value1",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "pow",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         },
         {
            "name" : "y",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number, : number) : number"
   },
   {
      "word" : "random",
      "definedClass" : "Math",
      "args" : [],
      "returnType" : "number",
      "type" : "function () : number"
   },
   {
      "word" : "round",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "sin",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "sqrt",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "tan",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "x",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number) : number"
   },
   {
      "word" : "max",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "value1",
            "type" : "number"
         },
         {
            "name" : "value2",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number, : number) : number"
   },
   {
      "word" : "min",
      "definedClass" : "Math",
      "args" : [
         {
            "name" : "value1",
            "type" : "number"
         },
         {
            "name" : "value2",
            "type" : "number"
         }
      ],
      "returnType" : "number",
      "type" : "function (: number, : number) : number"
   }
]
*/
/*JSX_OPTS
--complete 2:23
*/

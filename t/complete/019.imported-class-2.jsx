import "./lib/foo.jsx";

class C {
  function f() : void {
    new Foo().
/*EXPECTED
[
  {
    "word" : "instanceMemberMethod",
    "args" : [],
    "definedClass" : "Foo",
    "returnType" : "void",
    "type" : "Foo.function () : void"
  },
  {
    "word" : "toString",
    "args" : [],
    "definedClass" : "Object",
    "returnType" : "string",
    "type" : "Object.function () : string"
  }
]
*/
/*JSX_OPTS
--complete 5:15
*/
// vim: set expandtab tabstop=2 shiftwidth=2:

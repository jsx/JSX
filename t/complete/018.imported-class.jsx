import "./lib/foo.jsx";

class C {
  function f() : void {
    Foo.
/*EXPECTED
[
  {
    "word" : "<"
  },
  {
    "word" : "staticMemberMethod",
    "args" : [],
    "definedClass" : "Foo",
    "returnType" : "void",
    "type" : "function () : void"
  }
]
*/
/*JSX_OPTS
--complete 5:9
*/
// vim: set expandtab tabstop=2 shiftwidth=2:

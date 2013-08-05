
class Foo {
  function constructor(a : number, b : number) {}
  function constructor(c : string[]) { }
}

class C {
  function f() : void {
    new Fo
/*EXPECTED
[
  "TODO: should includes both Foo(:number, :number) and Foo(:strin[])"
]
*/
/*JSX_OPTS
--complete 9:11
*/
// vim: set expandtab tabstop=2 shiftwidth=2:

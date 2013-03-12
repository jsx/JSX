class C {
  static function f() : C[] {
    return [new C, new C];
  }
}

class _Test {
  function testFoo() : void {
    this.

    var a = C.f();
    var x = a[0];
  }
}
/*EXPECTED
["???"]
*/
/*JSX_OPTS
--complete 9:9
*/
// vim: set tabstop=2 shiftwidth=2 expandtab:

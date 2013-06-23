/*EXPECTED
f
1
42
foo
f
10
20
foo
f
100
200
bar
g
[value]
g
foo
h
[value]
bar
*/
class _Main {
  var value = "value";

  // instance method
  function f(a : number, b : number = 42, c : string = "foo") : void {
    log "f";
    log a;
    log b;
    log c;
  }

  // complex expression
  function g(a : string = "[" + this.value + "]") : void {
    log "g";
    log a;
  }

  // non-void
  function h(a : string = "[" + this.value + "]") : string {
    return a;
  }

  static function main(args : string[]) : void {
      var o = new _Main;
      o.f(1);
      o.f(10, 20);
      o.f(100, 200, "bar");
      o.g();
      o.g("foo");

      log "h";
      log o.h();
      log o.h("bar");
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:

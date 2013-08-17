/*EXPECTED
ok
*/

class X.<T,U> {
  function f () : U.<T> {
    return new U.<T>;
  }
}

class A {
}
class B.<T> {
  var foo = "ok";
}

class _Main {
  static function main (args : string[]) : void {
    var x = new X.<A,B>.f();
    log x.foo;
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


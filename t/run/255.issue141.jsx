/*EXPECTED
123
abc
*/
/*JS_SETUP
function Native() {
}
Native.prototype.dump = function (s) {
  console.log(s);
}
*/
native class Native.<T> {
  function dump(s : T) : void;
}

class _Main {
  static function doit(o : Native.<number>) : void {
    o.dump(123);
  }
  static function doit(o : Native.<string>) : void {
    o.dump("abc");
  }
  static function main(args : string[]) : void {
    var a = new Native.<number>();
    _Main.doit(a);
    var b = new Native.<string>();
    _Main.doit(b);
  }
}

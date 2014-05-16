/*EXPECTED
abc
def
*/

native class Native.<T> {
  static function f () : void;
  function f () : void;
} = """
(function () {
  function Native(){};
  Native.f = function () { console.log("abc"); };
  Native.prototype.f = function () { console.log("def"); };
  return Native;
})()
""";

class _Main {
  static function main(args : string[]) : void {
    Native.<number>.f();
    (new Native.<string>).f();
  }
}

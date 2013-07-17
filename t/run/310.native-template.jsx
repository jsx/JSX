/*EXPECTED
abc
def
*/

native class Native.<T> {
} = "function Native(){}";

class _Main {
  static function f(o : Native.<string>) : void {
    log "abc";
  }
  static function f(o : Native.<number>) : void {
    log "def";
  }
  static function main(args : string[]) : void {
    _Main.f(new Native.<string>);
    _Main.f(new Native.<number>);
  }
}

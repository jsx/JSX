/*EXPECTED
C: foo
C: _Main
C: null
*/

class C.<T> {
  var value : T;
  function constructor(value : T) {
    this.value = value;
  }

  function debugLog() : void {
    log "C: " + this.value as string;
  }
}

class _Main {
  override function toString() : string {
    return "_Main";
  }

  static function main(args : string[]) : void {
    new C.<string>("foo").debugLog();
    new C.<_Main>(new _Main).debugLog();
    new C.<_Main>(null).debugLog();
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:

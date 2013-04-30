/*EXPECTED
abc
def
*/
/*JS_SETUP
function Native() {
}
*/
import "264.instantiated-classname-conflict/abc.jsx" into abc;
import "264.instantiated-classname-conflict/def.jsx" into def;

native class Native.<T> {
}

class _Main {
  static function f(o : Native.<abc.C>) : void {
    log "abc";
  }
  static function f(o : Native.<def.C>) : void {
    log "def";
  }
  static function main(args : string[]) : void {
    _Main.f(new Native.<abc.C>);
    _Main.f(new Native.<def.C>);
  }
}

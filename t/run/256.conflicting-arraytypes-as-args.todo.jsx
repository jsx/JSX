/*EXPECTED
abc
def
*/
import "256.conflicting-arraytypes-as-args/abc.jsx" into abc;
import "256.conflicting-arraytypes-as-args/def.jsx" into def;

class _Main {
  static function f(o : Array.<abc.C>) : void {
    log "abc";
  }
  static function f(o : Array.<def.C>) : void {
    log "def";
  }
  static function main(args : string[]) : void {
    _Main.f(new Array.<abc.C>);
    _Main.f(new Array.<def.C>);
  }
}

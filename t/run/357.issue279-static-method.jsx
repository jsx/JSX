/*EXPECTED
ok
*/

class StaticParent
{
    static function f() : void { }
}

class StaticInstanceChild extends StaticParent
{
    function f() : void { }
}

class _Main {
  static function main(args : string[]):void {
    log "ok";
  }
}

// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:

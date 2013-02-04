// https://github.com/jsx/JSX/issues/50
/*EXPECTED
ok
*/

class _Main {
  static function takeArray(args : string[]) : void { }

  static function main(args : string[]) : void {
    _Main.takeArray([]);
    log "ok";
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


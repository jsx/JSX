/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize inline,dce
*/
class _Main {
  static function functionWithSideEffect() : number {
    log "foo";
    return 0;
  }
  static function main(args : string[]) : void {
    var x = { foo : _Main.functionWithSideEffect(), bar : 42 };
    // x is unused intentionally
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


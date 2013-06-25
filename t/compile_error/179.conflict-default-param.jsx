class _Main {
  static function f() : void {
    log "f()";
  }
  static function f(a : number = 42) : void {
    log "f(" + a as string + ")";
  }

  static function main(args : string[]) : void {
    _Main.f();
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


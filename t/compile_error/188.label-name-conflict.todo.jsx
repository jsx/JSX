
class _Main {
  static function main (args : string[]) : void {
    foo: for (;;) {
      foo: for (;;) {
          break foo;
      }
    }
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


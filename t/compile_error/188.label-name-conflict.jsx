
class _Main {
  static function main (args : string[]) : void {
    foo: for (;0;) {
      foo: for (;1;) {
          break foo;
      }
    }
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


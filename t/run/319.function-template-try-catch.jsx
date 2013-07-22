/*EXPECTED
foo
bar
*/

class C {
  static function useTryCatch.<T>(message : string) : void {
    try {
      throw new T(message);
    }
    catch (e : T) {
      log e.message;
    }
  }
}

class _Main {
  static function main(args : string[]) : void {
    C.useTryCatch.<SyntaxError>("foo");
    C.useTryCatch.<TypeError>("bar");
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:

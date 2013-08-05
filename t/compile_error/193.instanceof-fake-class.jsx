
native __fake__ class A { }

class _Main {
  static function main(args : string[]) : void {
    var o = new Object;
    log o instanceof A;
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


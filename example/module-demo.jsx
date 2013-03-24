import "./lib/foo.jsx" into foo;
import "./lib/bar.jsx" into bar;

class _Main {
  static function main(args : string[]) : void {
    log foo.MyClass.getName(); // "MyClass@foo.jsx"
    log bar.MyClass.getName(); // "MyClass@bar.jsx"
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


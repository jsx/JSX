/*EXPECTED
a.jsx
b.jsx
*/
// multipie In-line Native Definitions should be allowed

import "./306.multi-ind/a.jsx" into a;
import "./306.multi-ind/b.jsx" into b;

class _Main {
  static function main(args : string[]) : void {
    log a.Foo.name;
    log b.Foo.name;
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:

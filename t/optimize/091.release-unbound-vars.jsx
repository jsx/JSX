/*EXPECTED
foo
bar
true
*/
/*JSX_OPTS
--enable-release-vars
*/

class EventEmitter {
  var _listeners = new Array.<() -> void>;

  function addEventListener(listener : () -> void) : void {
    this._listeners.push(listener);
  }

  function hasListeners() : boolean {
    return this._listeners.length != 0;
  }
}


class _Main {
  static function f() : EventEmitter {
    var foo = "foo";
    var bar = "bar";

    log foo;
    log bar;

    var o = new EventEmitter;
    o.addEventListener(() -> {
      var z = 42;
      log foo;
      log z;
    });
    // XXX: bar should be released here
    return o;
  }


  static function main(args : string[]) : void {
    var o = _Main.f();
    log o.hasListeners();
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:

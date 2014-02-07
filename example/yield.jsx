/***
 * Experimental generator
 */

import "timer.jsx";

class Async {
  static function sleep(durationMS : number) : (variant) -> void {
    return (g) -> {
      Timer.setTimeout(() -> {
        Async.go(g);
      }, durationMS);
    };
  }

  static function run(coro : () -> Generator.<(variant)->void>) : void {
    Async.go(coro());
  }

  static function go(v : variant) : void {
    var g = v as Generator.<(variant)->void>;

    var data = g.next();
    if (data.done) {
      return; // nothing
    } else {
      data.value(g);
    }
  }
}

class _Main {
  static function main(args : string[]) : void {
    Async.run(function * () {
      log "H";
      yield Async.sleep(100);
      log "e";
      yield Async.sleep(100);
      log "l";
      yield Async.sleep(100);
      log "l";
      yield Async.sleep(100);
      log "o";
    });
  }
}
// vim: set tabstop=2 shiftwidth=2 expandtab:


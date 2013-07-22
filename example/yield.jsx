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

  static function run(coro : () -> g_Enumerable.<(variant)->void>) : void {
    Async.go(coro());
  }

  static function go(v : variant) : void {
    var g = v as g_Enumerable.<(variant)->void>;
    try {
      var cb = g.next();
      cb(g);
    }
    catch (si : g_StopIteration) {
      return; // nothing
    }
  }
}

class _Main {
  static function main(args : string[]) : void {
    Async.run(() -> {
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


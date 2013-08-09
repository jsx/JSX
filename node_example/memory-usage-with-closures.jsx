/***
 * A JSX application which scales memory usage on --disable-release-unbound-vars
 */

import "console.jsx";
import "js/nodejs.jsx";

class LargeObject {
  static const A = "abcdefghijklmnopqrstuvwxyz"
    +"abcdefghijklmnopqrstuvwxyz" +"abcdefghijklmnopqrstuvwxyz"
    +"abcdefghijklmnopqrstuvwxyz" +"abcdefghijklmnopqrstuvwxyz"
    +"abcdefghijklmnopqrstuvwxyz" +"abcdefghijklmnopqrstuvwxyz"
    +"abcdefghijklmnopqrstuvwxyz" +"abcdefghijklmnopqrstuvwxyz"
    +"abcdefghijklmnopqrstuvwxyz" +"abcdefghijklmnopqrstuvwxyz"
    +"abcdefghijklmnopqrstuvwxyz" +"abcdefghijklmnopqrstuvwxyz";
  var a0 = LargeObject.A.split("");
  var a1 = LargeObject.A.split("");
  var a2 = LargeObject.A.split("");
  var a3 = LargeObject.A.split("");
  var a4 = LargeObject.A.split("");
}

class _Main {
  static function reportRSS() : void {
    var usage = Math.round((process.memoryUsage().rss) / (1024 * 1024));
    var bar = "";
    for (var i = 0; i < usage; i += 3) {
      bar += "*";
    }
    var s = usage as string;
    while (s.length < 3) {
      s = " " + s;
    }
    console.log(s + " MiB" + bar);
  }

  static function main(args : string[]) : void {
    _Main.reportRSS();

    var t0 = Date.now();

    var q = new Array.<()->void>;

    for (var i = 0; i < 10; ++i) {
      (function tick() : void {
        var now = Date.now();

        var largeObjects = new LargeObject[];
        for (var i = 0; i < 1000; ++i) {
          largeObjects.push(new LargeObject);
        }

        q.push(() -> {
          console.log(now);
          //console.log(largeObjects); // capture large objects
        });

        _Main.reportRSS();
      }());
    }
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


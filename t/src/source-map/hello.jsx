// for source mapping

import "timer.jsx";
import "console.jsx";

class _Main {
    var foo = 42;
    static var bar = "hi";

    function getFoo() : number[] {
        return [this.foo].concat([999]);
    }

    static function run() : void {
        console.log("Hello, world!");
    }

    static function main(args : string[]) : void {
        Timer.setTimeout(function () : void {
            _Main.run();

            var m = new _Main();
            console.log(m.getFoo());
        }, 0);
    }
}

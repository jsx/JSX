// for source mapping

import "timer.jsx";

class _Main {
    var foo = 42;
    static var bar = "hi";

    function getFoo() : number {
        return this.foo;
    }

    static function run() : void {
        log "Hello, world!";
    }

    static function main(args : string[]) : void {
        Timer.setTimeout(function () : void {
            _Main.run();
        }, 0);
    }
}

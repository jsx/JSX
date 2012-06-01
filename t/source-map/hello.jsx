// for source mapping

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
        _Main.run();
    }
}

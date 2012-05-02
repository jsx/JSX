class Hello {
    var foo = 42;

    function getFoo() :number {
        return this.foo;
    }

    static function run() :void {
        log "Hello, world!";
    }
}

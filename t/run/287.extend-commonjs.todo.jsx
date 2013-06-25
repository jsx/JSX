/*EXPECTED
Base
Derived
*/
native("require('./t/run/287.extend-commonjs/base.js').Base") class Base {
    function say() : void;
}

class Derived extends Base {
    override function say() : void {
        log "Derived";
    }
}

class _Main {
    static function main(args : string[]) : void {
        new Base().say();
        new Derived().say();
    }
}

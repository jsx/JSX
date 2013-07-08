/*EXPECTED
Base
Derived
*/
native class Base {
    function say() : void;
} = "require('./t/run/287.extend-commonjs/base.js').Base";

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

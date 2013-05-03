/*EXPECTED
Derived
*/
class Base {
    function say() : void {
        log "Base";
    }
}
__export__ class Derived extends Base {
    override function say() : void {
        log "Derived";
    }
}
class _Main {
    static function doit(b : Base) : void {
        b.say();
    }
    static function main(args : string[]) : void {
        _Main.doit(new Derived);
    }
}

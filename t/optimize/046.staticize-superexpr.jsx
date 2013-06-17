/*EXPECTED
hi
*/
/*JSX_OPTS
--optimize lto,staticize
*/
class Base {
    function say() : void {
        log "hi";
    }
}
class Derived extends Base {
    function doit() : void {
        super.say();
    }
}
class _Main {
    static function main(args : string[]) : void {
        (new Derived).doit();
    }
}

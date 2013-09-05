/*EXPECTED
Hi
*/
__export__ class K {
    delete function constructor() {}
    static function doit() : void {
        log "Hi";
    }
}
class _Main {
    static function main(args : string[]) : void {
        K.doit();
    }
}

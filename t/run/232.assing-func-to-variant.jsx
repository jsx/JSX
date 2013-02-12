/*EXPECTED
Hello
*/
class _Main {
    static function main(args : string[]) : void {
        var v : variant = function () : void {
            log "Hello";
        };

        (v as function():void)();
    }
}
// vim: set expandtab:

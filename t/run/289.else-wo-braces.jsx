/*EXPECTED
f
*/
class _Main {
    static function main(args : string[]) : void {
        if (false)
            throw new Error();
        else
            log "f";
    }
}
// vim: set expandtab:

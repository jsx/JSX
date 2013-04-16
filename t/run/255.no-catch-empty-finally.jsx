/*EXPECTED
abc
*/
class _Main {
    static function main(args : string[]) : void {
        try {
            log "abc";
        } finally {
        }
    }
}

/*EXPECTED
*/
class _Main {
    static function main (args : string[]) : void {
        var a : function (:boolean) : void;
        var b : function (:boolean) : void;
        a = b = function (recurse:boolean) : void {
            log "Hi";
            if (recurse) a(false);
        };
    }
}

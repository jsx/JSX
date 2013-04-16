/*EXPECTED
1
*/
class _Main {
    function myMethod() : int {
        var x = 1;
        try {
            return x;
        } finally {
        }
    }
    static function main(args : string[]) : void {
        log (new _Main).myMethod();
    }
}

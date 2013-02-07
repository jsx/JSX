/*EXPECTED
undefined
null access
        var y : number = a.pop();
                              ^

*/

class _Main {
    static function main(args : string[]) : void {
        var a = [ 3 ];
        a.pop();
        var x : Nullable.<number> = a.pop();
        log x;
        var y : number = a.pop();
        log y;
    }
}
// vim: set expandtab:

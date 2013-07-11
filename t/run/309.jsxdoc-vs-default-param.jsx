/*EXPECTED
*/
class K {
    /**
     * @param a the parameter
     */
    static function f(a : number = 0) : void {
    }
}
class _Main {
    static function main(args : string[]) : void {
        K.f();
    }
}

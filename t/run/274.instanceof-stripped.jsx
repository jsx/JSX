/*EXPECTED
false
*/
class _Foo {
}
class _Main {
    static function main(args : string[]) : void {
        var o = new Object;
        log o instanceof _Foo;
    }
}

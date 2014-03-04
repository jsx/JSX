/*EXPECTED
a
*/
/*JSX_OPTS
--minify
*/
import "console.jsx";

class A {
    __export__ function a() : void {
        console.log('a');
        }
    __export__ function _() : void {
        console.log('b');
    }
}

class _Main {
    static function main(argv: string[]) : void {
        var a = new A();
        a.a();
    }
}

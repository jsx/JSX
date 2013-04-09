/*EXPECTED
123
*/
/*JS_SETUP
function Native() {
    this.A = 123;
}
*/

native class Native {
    var A : number;
}

class Derived extends Native {
    var foo = "abc";
}

class _Main {
    static function main(args : string[]) : void {
        var d = new Derived;
        log d.A;
    }
}

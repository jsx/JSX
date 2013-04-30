/*EXPECTED
123
*/
/*JS_SETUP
function Native() {
    this._ = 123;
}
*/

native class Native {
    var _ : number;
}

class Derived extends Native {
    var foo = "abc";
}

class _Main {
    static function main(args : string[]) : void {
        var d = new Derived;
        log d._;
    }
}

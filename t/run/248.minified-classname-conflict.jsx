/*EXPECTED
ok
*/
/*JS_SETUP
function A() {
    console.log("ok");
}
*/
native class A {
}

class _Main {
    function constructor() {
        log "should never get called";
    }
    static function main(args : string[]) : void {
        new A();
    }
}

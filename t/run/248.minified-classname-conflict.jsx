/*EXPECTED
ok
*/
/*JS_SETUP
function _() {
    console.log("ok");
}
*/
native class _ {
}

class _Main {
    function constructor() {
        log "should never get called";
    }
    static function main(args : string[]) : void {
        new _();
    }
}

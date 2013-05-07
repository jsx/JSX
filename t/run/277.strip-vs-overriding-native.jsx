/*EXPECTED
Hi!
*/
/*JS_SETUP
function Native() {
  this.say();
}
*/
native class Native {
    function say() : void;
}
class _Main extends Native {
    static function main(args : string[]) : void {
        new _Main;
    }
    override function say() : void {
        log "Hi!";
    }
}

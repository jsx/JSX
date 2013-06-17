/*EXPECTED
hello:[object Object]
*/
class _Main {
    override function toString() : string {
        return "hello:" + super.toString();
    }
    static function main(args : string[]) : void {
        log new _Main().toString();
    }
}

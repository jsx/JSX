/*EXPECTED
123
*/
class _Main {
    var n = 123;
    function constructor() {
	this.n = this.n;
    }
    static function main(args : string[]) : void {
        log (new _Main).n;
    }
}

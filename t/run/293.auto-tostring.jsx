/*EXPECTED
C{s="str", i=10, n=10, b=true, a=[a], m=[object Object], on=null, ox=(10,20), r=/pat/}
*/

class P {
    var x = 10;
    var y = 20;

    override function toString() : string {
        return "(" + this.x as string + "," + this.y as string + ")";
    }
}

class C {
    static var svar = 10;
    var s = "str";
    var i = 10 as int;
    var n = 10 as number;
    var b = true;
    var a = ["a"]; // TODO
    var m = { key : "value" }; // TODO
    var on = null : Object;
    var ox = new P;
    var r  = new RegExp("pat");
}

class _Main {
    static function main(args : string[]) : void {
        log new C().toString();
    }
}
// vim: set expandtab tabstop=4 shiftwidth=4:

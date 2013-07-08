/*EXPECTED
Hi
0
*/
/*JSX_OPTS
--optimize lto,unbox
*/
import "console.jsx";

class Point {
    var x = 0;
    var y = 0;
    function constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
    function distance() : number {
        console.log("Hi"); // prevent inline expansion
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class _Main {
    static function main(args : string[]) : void {
        var x = Math.random() | 0;
        var y = Math.random() | 0;
        var pt = new Point(x, y);
        function f() : void {
            console.log(pt.distance());
        };
        f();
    }
}

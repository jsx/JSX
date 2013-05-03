/*EXPECTED
Derived#say:123
*/
/*JS_SETUP
function newDerived() {
    var Base = JSX.require("t/run/270.extend-in-js.jsx").Base;
    var Derived = function () {
        Base.call(this); // call super class ctor
        console.log("Derived#new");
    };
    Derived.prototype = (function () {
        function f() {}
        f.prototype = Base.prototype;
        return new f();
    })();
    Derived.prototype.say = function () {
        console.log("Derived#say:" + this.n);
    }
    return new Derived;
}
*/

import "js.jsx";

__export__ class Base {
    // n and say are automatically exported
    var n = 123;
    function say() : void {
        log "should never see this";
    }
}
class _Main {
    static function main(args : string[]) : void {
        var derived = js.eval("newDerived()") as Base;
        derived.say();
    }
}

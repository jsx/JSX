/*EXPECTED
ok
*/
/*JSX_OPTS
--optimize no-assert
*/
class _Main {
    var m = (function () : number {
        assert !"seven";
        return 123;
    })();
    var mf = function () : void {
        assert !"eight";
    };
    function f() : void {
        assert !"one";
        (function () : void {
            assert !"two";
        })();
        function g() : void {
            assert !"three";
        }
        g();
    }
    static var s = (function () : number {
        assert !"nine";
        return 123;
    })();
    static var sf = function (n : number) : void {
        assert !"ten";
    };
    static function f() : void {
        assert !"four";
        (function () : void {
            assert !"five";
        })();
        function g() : void {
            assert !"six";
        }
        g();
    }
    static function main(args : string[]) : void {
        var m = new _Main;
        m.f();
        m.mf();
        _Main.f();
        _Main.sf(_Main.s); // _use_ the variable since initialization is delayed
        log "ok";
    }
}

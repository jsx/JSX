class A {
    var m : () -> void;
}

class B extends A {
    function foo () : void {
        super.m();
    }
}

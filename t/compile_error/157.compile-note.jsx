class _Main {
    static function a () : void {}
    static function a (x : number) : void {}
    static function a (x : string) : void {}
    native static function a (x : number,
                       y : string) : void {}
    static function main(args : string[]) : void {
        _Main.a([1]);
    }
}

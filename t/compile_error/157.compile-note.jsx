class _Main {
    static function a (x : number) : void {}
    static function a (x : string) : void {}
    static function a (x : number,
                       y : string) : void {}

    static function main(args : string[]) : void {
        _Main.a([1]);
    }
}

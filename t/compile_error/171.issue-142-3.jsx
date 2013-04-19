class A.<T> {
	class B extends T {}
}

class _Main {
    static function main (args : string[]) : void {
        new A.<number>;
    }
}
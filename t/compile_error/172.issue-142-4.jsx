class A.<T> {
	class B.<U> extends T {}
}

class _Main {
    static function main (args : string[]) : void {
        new A.<number>;
    }
}
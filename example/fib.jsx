class Fib {
    static function calc(n : Int) : Int {
        if (n <= 2) {
            return 1;
        } else {
            return Fib.calc(n - 1) + Fib.calc(n - 2);
        }
    }
    static function main(args : String[]) : Int {
        log Fib.calc(3); // => 2
        log Fib.calc(4); // => 3
    }
}

package com.example.fizzbuzz;

class FizzBuzz {
    static function fizzbuzz() : Int {
        for (var i = 1; i <= 100; ++i) {
            log i % 15 == 0 ? "FizzBuzz" : i % 3 == 0 ? "Fizz" : i % 5 == 0 ? "Buzz" : i.toString();
        }
    }
}

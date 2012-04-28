#!bin/run-jsx-test
// import "test-simple"

class Test extends TestCase {
    function run() :void {
        this.expect("hello").toBe("hello");
    }
}

import "js/phantomjs/test-case.jsx";

class _Test extends PhantomTestCase {
  function testHello() : void {
    var got = "Hello, world!";
    this.expect(got).toBe("Hello, world!");
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

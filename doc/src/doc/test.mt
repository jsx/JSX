? my $context = $main::context;
? $_mt->wrapper_file("wrapper.mt")->(sub {
<style>
  .headerlink {
    display: none;
  }
</style>
<title>Unit Test - JSX</title>

?= $_mt->render_file("header.mt")
?= $_mt->render_file("breadcrumb.mt", [ qw(Documents doc.html compilerref.html) ], [ 'Unit Test' ])
<div id="main">

<h1>Unit Test</h1>

<h2>Introduction</h2>

<p>
JSX has a built-in test runner invoked by <code>--test</code> option and has an unit test framework <code>test-case.jsx</code>. The unit test framework is an xUnit style, running <code>_Test#test*():void</code> of the given file.
</p>
<p>
Here is a simple test file, which is typically placed in <code>t/</code> of a project.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
import "test-case.jsx";

class _Test extends TestCase {
  function testAdd() : void {
    this.expect(1 + 2).toBe(3);
    this.expect(1 + 3).toBe(4);
  }
}
EOT
?>

<p>To run the test file, invoke <code>jsx --test test.jsx</code>, and you will see a <a href="http://en.wikipedia.org/wiki/Test_Anything_Protocol" title="Test Anything Protocol">TAP</a> output like:</p>

<pre>
1..1
  ok 1
  ok 2
  1..2
ok 1 - testAdd
</pre>

<p>NOTE: it is recommended to use prove(1) to run tests and parse TAP, which can run test files in parallel. See .proverc and and Makefile in the <a href="https://github.com/jsx/mizuki">mizuki</a> project.</p>

<h2>Synchronous Test</h2>

<p>Synchronous testing is really simple, where you just define test methods, which are invoked in serial.</p>

For example, the folowing test class calls <code>testFirst()</code>, <code>testSecond()</code>, <code>testThird()</code> in this order.

<?= $context->{prettify}->('jsx', <<'EOT')
import "test-case.jsx";

class _Test extends TestCase {
  function testFirst() : void {
    this.expect(1 + 2).toBe(3);
  }
  function testSecond() : void {
    this.expect(1 + 3).toBe(4);
  }
  function testThird() : void {
    this.expect(1 + 4).toBe(5);
  }
}
EOT
?>

<h2>Asynchronous Test</h2>

<p>
<code>test-case.jsx</code> supports asynchronous tests to test callback-based methods, such as <code>Timer.setTimeout()</code>.</p>

<p>An asynchronous test starts with <code>this.async()</code> method, taking a block with an AsyncContext instance, and telling it that the test is done.</p>

<?= $context->{prettify}->('jsx', <<'EOT')
import "test-case.jsx";

class _Test extends TestCase {
  function testSetTimeout() : void {
    this.async(function(async : AsyncContext) : void {
      var to = 200;
      var t0 = Date.now();
      Timer.setTimeout(function() : void {
        var t1 = Date.now();

        this.expect(t1 - t0, "setTimeout 200 ms.").toBeGE(to - 50);

        async.done(); // to tell this test is finished
      }, to);
    }, 1000 /* timeout in milliseconds */);
  }
}
EOT
?>

<h2>Set Up / Tear Down</h2>

<p>You can define <code>setUp()</code> / <code>tearDown()</code> which are called for each test method to manage test environments.</p>

<p>These methods take no arguments for synchronous test methods, while take an AsyncContext for asynchronous test methods.</code>

<?= $context->{prettify}->('jsx', <<'EOT')
import "test-case.jsx";

// for synchronous test
class _Test extends TestCase {
  override function setUp() : void {
    this.diag("setUp");
  }
  override function tearDown() : void {
    this.diag("tearDown");
  }

  function testFoo() : void {
    this.pass("foo");
  }
  function testBar() : void {
    this.pass("bar");
  }
}
EOT
?>

<?= $context->{prettify}->('jsx', <<'EOT')
import "test-case.jsx";
import "timer.jsx";

// for asynchronous test
class _Test extends TestCase {
  override function setUp(async : AsyncContext) : void {
    this.diag("setUp for " + async.name());
  }
  override function tearDown(async : AsyncContext) : void {
    this.diag("tearDown for " + async.name());
  }

  function testFooAsync() : void {
    this.async((async) -> {
      Timer.setTimeout(() -> {
        this.pass("foo");
        async.done();
      }, 1);
    }, 1000);
  }

  function testBarAsync() : void {
    this.async((async) -> {
      Timer.setTimeout(() -> {
        this.pass("bar");
        async.done();
      }, 1);
    }, 1000);
  }
}
EOT
?>

<h2>Misc.</h2>

<p>jsx --test can takes test method names to run specific tests in a file. When you use <a href="https://github.com/jsx/jsx.vim">jsx.vim</a> you can run the currently editing test method by <code>\t</code>.</p>

<h2>See Also</h2>

<ul>
  <li><a href="http://jsx.github.io/jsxdoc/lib/common/test-case.jsx.html">test-case.jsx reference</a></li>
  <li><a href="https://github.com/jsx/JSX/tree/master/t/lib">JSX/t/lib/*.jsx</a> for example</li>
</ul>

</div>

? })

import "test-case.jsx";

import "js/nodejs.jsx";

class _Test extends TestCase {
  function testProcess() : void {
    var cwd = process.cwd();
    this.expect(cwd).notToBe("");
  }

  function testFS() : void {
    var dir = node.__dirname;
    var st  = node.fs.statSync(dir);

    this.expect(st.isDirectory()).toBe(true);
  }


  function testBuffer() : void {
    var b = new Buffer(3);
    b.write("foo", 0, 3, "ascii");

    this.expect(b.length).toBe(3);
    this.expect(b.toString()).toBe("foo");

    this.expect(Buffer.byteLength("foo", "ascii")).toBe(3);
  }

  function testUrl() : void {
    var url = node.url.parse("http://example.com/foo/bar?k=x&k=y#here");
    this.expect(url.protocol).toBe("http:");
    this.expect(url.host).toBe("example.com");
    this.expect(url.hash).toBe("#here");
    this.expect(url.query).toBe("k=x&k=y");
    this.expect(url.pathname).toBe("/foo/bar");

    this.expect(node.url.resolve("/foo/bar", "baz")).toBe("/foo/baz");
  }

  function testPath() : void {
    var path = "/foo/bar/baz.txt";
    this.expect(node.path.basename(path)).toBe("baz.txt");
    this.expect(node.path.dirname(path)).toBe("/foo/bar");
    this.expect(node.path.normalize(path)).toBe("/foo/bar/baz.txt");
  }

  function testHttpServer() : void {
    this.async((async) -> {
      process.nextTick(() -> {
        node.http.get("http://localhost:4321/foo/bar", (res) -> {
          this.expect(res.statusCode, "http request to myself").toBe(200);
          async.done();
        }).on("error", (arg) -> {
          var error = arg as Error;
          this.fail("HTTP request error: " + error.toString());
        });;
      });

      var httpd : Server = null;
      httpd = node.http.createServer((req, res) -> {
        this.expect(req.url, "accept a request").toBe("/foo/bar");

        res.writeHead(200, { "content-type" : "text/plain" });
        res.write("ok", "utf8");
        res.end();

        httpd.close();
      });
      httpd.listen(4321);
    }, 1000);
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


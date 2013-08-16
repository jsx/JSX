import "test-case.jsx";

import "js/nodejs.jsx";

class _Test extends TestCase {

  // NodeJS build-in modules

  function testProcess() : void {
    var t0 = process.hrtime();

    var cwd = process.cwd();
    this.expect(cwd).notToBe("");

    this.expect(process.stdin.fd,  "stdin.fd").toBeGE(0);
    this.expect(process.stdout.fd, "stdout.fd").toBeGE(0);
    this.expect(process.stderr.fd, "stderr.fd").toBeGE(0);

    var elapsed = process.hrtime(t0);
    var seconds = elapsed[0] + elapsed[1] / 1e9;
    //this.note("hrtime: " + seconds as string + " [sec]");
    this.expect(seconds).toBeGE(0);
  }

  function testBuffer() : void {
    this.expect(Buffer.byteLength("foo", "ascii"), "Buffer.byteLength").toBe(3);
    this.expect(Buffer.byteLength("foo", "utf8"), "Buffer.byteLength").toBe(3);

    this.expect(Buffer.concat([new Buffer("foo", "utf8"), new Buffer("bar", "utf8")]).toString(), "Buffer.concat").toBe("foobar");
    this.expect(Buffer.concat([new Buffer("foo", "utf8"), new Buffer("bar", "utf8")], 5).toString(), "Buffer.concat").toBe("fooba");

    var b = new Buffer(3);
    b.write("foo", 0, 3, "ascii");

    this.expect(b.length, "length").toBe(3);
    this.expect(b.toString(), "toString()").toBe("foo");
    this.expect(b.toString("utf8"), "toString(encoding)").toBe("foo");
    this.expect(b.toString("utf8", 1), "toString(encoding, start)").toBe("oo");
    this.expect(b.toString("utf8", 0, 2), "toString(encoding, start, end)").toBe("fo");

    this.expect(b.slice(1).toString(),    "slice").toBe("oo");
    this.expect(b.slice(0, 2).toString(), "slice").toBe("fo");

    (new Buffer("bar", "utf8")).copy(b);
    this.expect(b.toString(), "copy").toBe("bar");

    var b2 = new Buffer(1024);

    b2.writeUInt8(0, 0);
    this.expect(b2.readUInt8(0), "read/write").toBe(0);
    b2.writeUInt8(0xff, 1);
    this.expect(b2.readUInt8(1)).toBe(0xff);

    b2.writeUInt16LE(0, 2);
    this.expect(b2.readUInt16LE(2)).toBe(0);
    b2.writeUInt16LE(0xffff, 4);
    this.expect(b2.readUInt16LE(4)).toBe(0xffff);
    b2.writeUInt16BE(0, 6);
    this.expect(b2.readUInt16BE(6)).toBe(0);
    b2.writeUInt16BE(0xffff, 8);
    this.expect(b2.readUInt16BE(8)).toBe(0xffff);

    b2.writeUInt32LE(0, 10);
    this.expect(b2.readUInt32LE(10)).toBe(0);
    b2.writeUInt32LE(0xffffffff, 14);
    this.expect(b2.readUInt32LE(14)).toBe(0xffffffff);
    b2.writeUInt32BE(0, 18);
    this.expect(b2.readUInt32BE(18)).toBe(0);
    b2.writeUInt32BE(0xffffffff, 22);
    this.expect(b2.readUInt32BE(22)).toBe(0xffffffff);

    b2.writeInt8(0, 26);
    this.expect(b2.readInt8(26)).toBe(0);
    b2.writeInt8(0x7f, 27);
    this.expect(b2.readInt8(27)).toBe(0x7f);
    b2.writeInt8(-0x80, 28);
    this.expect(b2.readInt8(28)).toBe(-0x80);

    b2.writeInt16LE(0, 29);
    this.expect(b2.readInt16LE(29)).toBe(0);
    b2.writeInt16LE(0x7fff, 31);
    this.expect(b2.readInt16LE(31)).toBe(0x7fff);
    b2.writeInt16LE(-0x8000, 33);
    this.expect(b2.readInt16LE(33)).toBe(-0x8000);
    b2.writeInt16BE(0, 35);
    this.expect(b2.readInt16BE(35)).toBe(0);
    b2.writeInt16BE(0x7fff, 37);
    this.expect(b2.readInt16BE(37)).toBe(0x7fff);
    b2.writeInt16BE(-0x8000, 39);
    this.expect(b2.readInt16BE(39)).toBe(-0x8000);

    b2.writeInt32LE(0, 41);
    this.expect(b2.readInt32LE(41)).toBe(0);
    b2.writeInt32LE(0x7fffffff, 45);
    this.expect(b2.readInt32LE(45)).toBe(0x7fffffff);
    b2.writeInt32LE(-0x80000000, 49);
    this.expect(b2.readInt32LE(49)).toBe(-0x80000000);
    b2.writeInt32BE(0, 53);
    this.expect(b2.readInt32BE(53)).toBe(0);
    b2.writeInt32BE(0x7fffffff, 57);
    this.expect(b2.readInt32BE(57)).toBe(0x7fffffff);
    b2.writeInt32BE(-0x80000000, 61);
    this.expect(b2.readInt32BE(61)).toBe(-0x80000000);

    b2.writeFloatLE(0.0625, 65);
    this.expect(b2.readFloatLE(65)).toBe(0.0625);
    b2.writeFloatBE(0.0625, 69);
    this.expect(b2.readFloatBE(69)).toBe(0.0625);

    b2.writeDoubleLE(Math.PI, 73);
    this.expect(b2.readDoubleLE(73)).toBe(Math.PI);
    b2.writeDoubleBE(Math.E, 81);
    this.expect(b2.readDoubleBE(81)).toBe(Math.E);

    var b3 = new Buffer(5);
    b3.fill(0x10);
    this.expect(b3.readUInt8(0), "fill").toBe(0x10);
    this.expect(b3.readUInt8(4)).toBe(0x10);

    b3.fill(0x20, 1);
    this.expect(b3.readUInt8(0)).toBe(0x10);
    this.expect(b3.readUInt8(1)).toBe(0x20);
    this.expect(b3.readUInt8(4)).toBe(0x20);

    b3.fill(0x30, 2, 4);
    this.expect(b3.readUInt8(0)).toBe(0x10);
    this.expect(b3.readUInt8(1)).toBe(0x20);
    this.expect(b3.readUInt8(2)).toBe(0x30);
    this.expect(b3.readUInt8(3)).toBe(0x30);
    this.expect(b3.readUInt8(4)).toBe(0x20);
  }

  // NodeJS standard modules

  function testFS() : void {
    var dir = node.__dirname;
    var st  = node.fs.statSync(dir);

    this.expect(st.isDirectory()).toBe(true);

    var tmpFile = dir + '.test.tmp';
    node.fs.writeFileSync(tmpFile, 'test1\n');
    node.fs.appendFileSync(tmpFile, 'test2\n');
    var content = node.fs.readFileSync(tmpFile, 'utf-8');
    this.expect(content).toBe('test1\ntest2\n');
    node.fs.unlinkSync(tmpFile);
    var exists = node.fs.existsSync(tmpFile);
    this.expect(exists).toBe(false);
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
    this.expect(node.path.normalize(path)).toBe("/foo/bar/baz.txt");
    this.expect(node.path.join('/foo', 'bar', 'baz/asdf', 'auux', '..')).toBe('/foo/bar/baz/asdf');
    this.expect(node.path.resolve('/foo/bar', './baz')).toBe('/foo/bar/baz');
    this.expect(node.path.resolve('/foo/bar', '/tmp/file/')).toBe('/tmp/file');
    this.expect(node.path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')).toBe(process.cwd() + '/wwwroot/static_files/gif/image.gif');
    this.expect(node.path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')).toBe('../../impl/bbb');
    this.expect(node.path.dirname(path)).toBe("/foo/bar");
    this.expect(node.path.basename(path)).toBe("baz.txt");
    this.expect(node.path.basename(path, '.txt')).toBe("baz");
    this.expect(node.path.extname('index.html')).toBe('.html');
    this.expect(node.path.extname('index.')).toBe('.');
    this.expect(node.path.extname('index')).toBe('');
    this.expect(['/', '\\'].indexOf(node.path.sep) != -1).toBe(true);
  }

  function testHttpServer() : void {
    if (true) return; // SKIP

    var port = 4321; // TODO: find an empty port correctly
    this.async((async) -> {
      process.nextTick(() -> {
        this.pass("requesting");
        node.http.get("http://localhost:"+port.toString()+"/foo/bar", (res) -> {
          this.expect(res.statusCode, "http request to myself").toBe(200);
          async.done();
        }).on("error", (arg) -> {
          var error = arg as Error;
          this.fail("HTTP request error: " + error.toString());
          async.done();
        });;
      });

      var httpd : HTTPServer = null;
      httpd = node.http.createServer((req, res) -> {
        this.expect(req.url, "accept a request").toBe("/foo/bar");

        res.writeHead(200, { "content-type" : "text/plain" });
        res.write("ok", "utf8");
        res.end();

        httpd.close();
      });
      httpd.listen(port);

      this.pass("listen " + port.toString());
    }, 4000);
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


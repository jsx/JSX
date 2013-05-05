// hint: run `make` if it sticks

import "js/phantomjs/test-case.jsx";
import "js/phantomjs.jsx";
import "js/web.jsx";

class _Test extends PhantomTestCase {
  var page : WebPage;
  var server : WebServer = null;

  var port   = 4321;

  override function setUp() : void {
    if (this.server == null) {
      this.server = webserver.create();
      this.server.listen(this.port, function (req, res) {
        var t0 = Date.now();
        var path = req.url.slice(1); // skip first "/"
        this.note("accept: " + path);

        var headers = {
          "Access-Control-Allow-Origin" : "*"
        };

        var content = "";
        if (fs.exists(path)) {
          content = fs.read(path);
          headers["Content-Type"] =
              path.match(/\.html$/) ? "text/html"
            : path.match(/\.css$/)  ? "text/css"
            : path.match(/\.js$/)   ? "application/javascript"
            : path.match(/\.json$/) ? "application/json"
            :                         "text/plain";
          headers["Content-Type"] += "; charset=UTF-8";
          res.writeHead(200, headers);
          res.write(content);
        }
        else {
          headers["Content-Type"] = "text/plain";
          res.writeHead(404, headers);
          res.write("file not found\n");
        }
        res.close();
        var elapsed = (Date.now() - t0) / 1000;
        this.note("  elapsed: " + elapsed as string +" sec."
            + " path: " + path
            + " size: " + content.length as string);
      });
      this.page = webpage.create();
    }

    // reset default handlers at each time
    this.page.onConsoleMessage = function(msg, line, id) {
      this.note("console: " + msg);
    };
    this.page.onAlert= function(msg) {
      this.note("alert: " + msg);
    };
    this.page.onError = function(msg, trace) {
      var message = msg + "\n";
      trace.forEach( (t) -> {
        var x = t as Map.<variant>;
        var file = x["file"] as string;
        var line = x["line"] as string;
        var func = x["function"] as string;
        message += file + ":" + line + " " + func + "\n";
      });
      this.fail("error: " + message);
    };
  }

  function testLoadingWebExampleHelloWorld() : void {
    var file = "try/example/hello-world/index.html";
    //var prefix = "http://0:" + this.port as string + "/";

    //file += "#debug"

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }

  function testLoadingWebExampleWebGL() : void {
    var file = "try/example/webgl/index.html";

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }

  function testLoadingWebExampleWebRTC() : void {
    var file = "try/example/webrtc/index.html";

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }

  function testLoadingWebExampleWebAudio() : void {
    var file = "try/example/webaudio/index.html";

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }

  function testLoadingWebExampleSakura() : void {
    var file = "try/example/sakura/index.html";

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }

  function testLoadingWebExampleShooting() : void {
    var file = "try/example/shooting/index.html";

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }

  function testLoadingWebExampleFireworks() : void {
    var file = "try/example/fireworks/index.html";

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }

  function testLoadingWebExampleIPCJS() : void {
    var file = "try/example/ipc-js/index.html";

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }

  function testLoadingWebExampleXHR() : void {
    var file = "try/example/xhr/index.html";

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }

  function testLoadingWebIndex() : void {
    var file = "try/index.html";
    //var prefix = "http://0:" + this.port as string + "/";

    //file += "#debug"

    this.async( (context) -> {
      this.page.open(file, function(status) {
        this.expect(status, "opened " + file).toBe("success");
        context.done();
      });
    }, 50000);
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

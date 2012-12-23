import "js/phantom-test-case.jsx";
import "js/phantom.jsx";
import "js/web.jsx";

class _Test extends PhantomTestCase {
  var page : WebPage;
  var server : WebServer = null;
  override function setUp() : void {
    if (this.server == null) {
      this.server = webserver.create();
      this.server.listen(4321, function (req, res) {
        var path = req.url.replace(new RegExp("^http://[^/]+/"), "");
        this.note("accept: " + path);

        try {
          var content = fs.read(system.env["PWD"] + path);
          res.writeHead(200, { "Content-Type" : "text/plain" });
          res.write(content);
        }
        catch (e : Error) {
          res.writeHead(404, { "Content-Type" : "text/plain" });
          res.write("file not found");
        }
        res.close();
      });
      this.page = webpage.create();
    }

    // reset default handlers at each time
    this.page.onConsoleMessage = function(msg, line, id) {
      this.note("console: " + msg);
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
      this.fail(message);
    };
  }

  function testExampleHelloWorld() : void {
    var file = "try/example/hello-world/index.html";

    this.async( (context) -> {
      this.page.open("http://0:4321/" + file, function(status) {
        this.pass("opened " + file);

        context.done();
      });
    }, 5000);
  }

}

// vim: set tabstop=2 shiftwidth=2 expandtab:

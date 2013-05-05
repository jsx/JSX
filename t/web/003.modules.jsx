import "js/phantomjs/test-case.jsx";
import "js/phantomjs.jsx";

class _Test extends PhantomTestCase {
  function testPhantom() : void {
    this.expect(phantom.version.major, 'phantom.version.major').toBeGE(1);
    this.expect(phantom.version.minor, 'phantom.version.minor').toBeGE(0);
    this.expect(phantom.version.patch, 'phantom.version.patch').toBeGE(0);
  }

  function testSystem() : void {
    this.expect(system.platform, 'system.platform').notToBe(null);
    this.expect(system.env instanceof Map.<string>).toBe(true);
    this.expect(system.args instanceof Array.<string>).toBe(true);
  }

  function testFS() : void {
    this.expect(fs.workingDirectory, 'fs.workingDirectory').notToBe(null);
  }

  function testWebPage() : void {
    var page = webpage.create();
    this.expect(page, 'webpage.create()').notToBe(null);
  }

  function testWebServer() : void {
    var server = webserver.create();
    this.expect(server, 'webserver.create()').notToBe(null);
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

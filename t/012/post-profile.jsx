
class _Main {
  static function heavyFunc() : number {
    var n = 0;
    for (var i = 0; i < 1000000; ++i) {
      n += Math.sin(i);
    }
    return n;
  }

  static function main(args : string[]) : void {
    var port = (args.length > 0 ? args[0] as int : 2012);

    log _Main.heavyFunc();

    JSX.postProfileResults("http://localhost:" + port as string + "/post-profile", (error, response) -> {
      log error;
      log response;
    });
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


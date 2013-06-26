/*EXPECTED
ok
*/

class _Main {
  static function main(args : string[]) : void {
    for (var i = 0; i < 10; i++);
    for (var i : number = 0; i < 10; i++);
    log "ok";
  }
}

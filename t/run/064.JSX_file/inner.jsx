class Outer {
  class Inner {
    function say() : void {
      log "inner#say";
    }
    static function say() : void {
      log "inner.say";
    }
  }
}

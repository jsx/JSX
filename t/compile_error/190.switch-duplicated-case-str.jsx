class _Main {
  static function main(args : string[]) : void {
    switch ("foo") {
    case "fo\x6f": log "a"; break;
    case "foo":    log "b"; break;
    }
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


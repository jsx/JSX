class _Main {
    function toString(a : number = 42) : string {
        log "should not override Object#toString() without 'override' attribute";
    }
}

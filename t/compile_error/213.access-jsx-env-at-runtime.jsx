class _Main {
	static function main(args : string[]) : void {
		for (var k in JSX.ENV) {
			log "k:" + JSX.ENV[k];
		}
	}
}

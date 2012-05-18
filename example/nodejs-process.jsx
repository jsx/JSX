
import "js/nodejs.jsx";

class _Main {
	static function main(args : string[]) : void {
		log "cwd: " + process.cwd();
		log "$HOME: " + process.env["HOME"];

		process.on("exit", function() :void {
			log "exit!";
		});
	}
}

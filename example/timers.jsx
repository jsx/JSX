import "timer.jsx";

class _Main {
	static function main(args : string[]) : void {
		var i = 0;
		var id : Nullable.<TimerHandle> = null;

		id = Timer.setInterval(function() : void {
			log ++i;

			if(i == 4) {
				Timer.clearInterval(id);
			}
		}, 500);
	}
}

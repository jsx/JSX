// works on only Chrome (as of 2013/2)
import "js/web.jsx";

class _Main {
	static function main(args : string[]) : void {
		log "application start";

		// WebRTC video
		try {
			dom.window.navigator.webkitGetUserMedia(
				{ video : true } : Map.<variant>,
				function (stream) {
					log "MediaStream start";
					var v = dom.id("video") as HTMLVideoElement;
					v.src = URL.createObjectURL(stream);
				}, function (error) {
					log error;
				});
		}
		catch (e : Error) {
			log e;
		}
	}
}

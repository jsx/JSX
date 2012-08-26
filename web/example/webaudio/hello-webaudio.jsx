import 'js/web.jsx';

class _Main {
	static function main(args : string[]) : void {
		(dom.id("start") as HTMLInputElement).disabled = true;
		(dom.id("stop")  as HTMLInputElement).disabled = true;
		try {
			_Main.init(new webkitAudioContext);
		}
		catch (e : Error) {
			log e;
		}
	}

	static function init(cx : AudioContext) : void {
		var app = new App(cx);

		app.init();
	}
}

class App {
	var audioFilename = "amairo.mp3";

	var cx : AudioContext;
	var source : AudioBufferSourceNode;
	var buffer : AudioBuffer = null;

	function constructor(cx : AudioContext) {
		this.cx = cx;
	}

	function setMessage(text : string) : void {
		var element = dom.id("message");

		var children = element.childNodes;
		for (var i = 0, l = children.length; i < l; ++i) {
			element.removeChild(children[i]);
		}

		element.appendChild(dom.document.createTextNode(text));
	}

	function init() : void {
		this.setMessage("WebAudio API is supported on this browser.");

		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.audioFilename);
		xhr.responseType = "arraybuffer";
		xhr.addEventListener("load", (e) -> {
			this.cx.decodeAudioData(xhr.response as ArrayBuffer, (buffer) -> {
				this.buffer = buffer;
				this.readyToStart();
			}, (buffer) -> {
				this.setMessage("Loading error.");
			});
		});
		xhr.send();
	}

	function readyToStart() : void {
		(dom.id("start") as HTMLInputElement).disabled = false;
		(dom.id("stop")  as HTMLInputElement).disabled = false;

		dom.id("start").addEventListener("click", (e) -> {
			this.start();
		});
		dom.id("stop").addEventListener("click", (e) -> {
			this.stop();
		});

	}

	function start() : void {
		log "start";

		var source = this.cx.createBufferSource();
		source.buffer = this.buffer;
		source.connect(this.cx.destination);
		source.noteOn(0);

		this.source = source;
	}

	function stop() : void {
		log "stop";

		this.source.noteOff(0);
	}
}



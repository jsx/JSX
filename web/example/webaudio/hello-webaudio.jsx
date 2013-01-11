/***

  WebAudio example, playing an MP3 music on browsers

  @see http://www.html5rocks.com/en/tutorials/webaudio/intro/

 */


import 'js/web.jsx';

class _Main {
    static function main(args : string[]) : void {
        try {
            var app = new App(new webkitAudioContext);
            app.init();
        }
        catch (e : Error) {
            log e;
        }
    }
}

class App {
    var audioFilename = "amairo.mp3";

    var cx : AudioContext;
    var source : AudioBufferSourceNode;

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
        xhr.responseType = "arraybuffer"; // for binary data

        xhr.addEventListener("load", (e) -> {
            var binary = xhr.response as ArrayBuffer;
            this.cx.decodeAudioData(binary, (buffer) -> {
                this.readyToStart(buffer);
            }, () -> {
                this.setMessage("Loading error.");
            });
        });

        xhr.send();
    }

    function readyToStart(buffer : AudioBuffer) : void {
        var start = dom.id("start") as __noconvert__ HTMLInputElement;
        var stop  = dom.id("stop")  as __noconvert__ HTMLInputElement;

        start.disabled = false;
        stop.disabled  = false;

        start.addEventListener("click", (e) -> {
            this.start(buffer);
        });
        stop.addEventListener("click", (e) -> {
            this.stop();
        });

    }

    function start(buffer : AudioBuffer) : void {
        log "start";

        var source = this.cx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.cx.destination);
        source.start(0);

        this.source = source;
    }

    function stop() : void {
        log "stop";

        this.source.stop(0);
    }
}

// vim: set expandtab:

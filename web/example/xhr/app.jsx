/***

  XMLHttpRequest example

 */


import 'js/web.jsx';
import 'console.jsx';

class _Main {
    static function main(args : string[]) : void {
        var xhr = new XMLHttpRequest();
        var path = dom.document.location.pathname;
        xhr.open("GET", path.replace(/\/[^\/]*$/, "") + "/hello.txt");
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == xhr.DONE) {
                _Main.update(xhr.responseText);
            }
        };
        xhr.onerror = function (e) {
            console.error("XHR error");
        };
        xhr.send();
    }

    static function update(text : string) : void {
        var output = dom.id("output");
        var textNode = dom.document.createTextNode(text);
        output.appendChild(textNode);
    }
}


// vim: set expandtab:

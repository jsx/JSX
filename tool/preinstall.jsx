import "js/nodejs.jsx";
import "console.jsx";

class _Main {
    static function copyFileSync(srcFile : string, destFile : string) : void {
        var BUF_LENGTH = 64*1024;
        var buff = new Buffer(BUF_LENGTH);
        var fdr = node.fs.openSync(srcFile, 'r');
        var fdw = node.fs.openSync(destFile, 'w');
        var bytesRead = 1;
        var pos = 0;
        while (bytesRead > 0) {
            bytesRead = node.fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
            node.fs.writeSync(fdw, buff, 0, bytesRead);
            pos += bytesRead;
        }

        node.fs.closeSync(fdr);
        node.fs.closeSync(fdw);
    }

    static function main(args : string[]) : void {
        if (process.platform == "win32") {
            //console.log("installing bin/jsx for Windows");
            //_Main.copyFileSync("bin/jsx-compiler.js", "bin/jsx");
        }
    }
}
// vim: set expandtab:

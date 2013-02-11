#!/usr/bin/env node
"use strict";

var fs = require("fs");

function copyFileSync(srcFile, destFile) {
    var BUF_LENGTH = 64*1024;
    var buff = new Buffer(BUF_LENGTH);
    var fdr = fs.openSync(srcFile, 'r');
    var fdw = fs.openSync(destFile, 'w');
    var bytesRead = 1
    var pos = 0
    while (bytesRead > 0) {
        bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
        fs.writeSync(fdw,buff,0,bytesRead);
        pos += bytesRead;
      }
    fs.closeSync(fdr)
    fs.closeSync(fdw)
}

if (process.platform == "win32" || true) {
    console.log("installing bin/jsx for Windows");
    copyFileSync("bin/jsx-compiler.js", "bin/jsx");
}
// vim: set expandtab:

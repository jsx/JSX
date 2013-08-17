#!/usr/bin/env node
"use strict";

var path = require('path');

function indent(level) {
  var s = ""
  for (var i = 0; i < level; ++i) {
    s += "  ";
  }
  return s;
}

process.argv.slice(2).forEach(function (file) {
  var module = require(file);
  
  var s = "";

  s += "/***\n";
  s += " * JSX interface to '" + file +"' module\n";
  s += " */\n";
  s += "\n";

  s += "native class " + path.basename(file, ".js") + " {\n";
  s += "  delete function constructor();\n\n";

  (function dumpModule(module, prefix, level) {
    for (var name in module) {
      if (/^_/.test(name) || /_$/.test(name)) {
        return;
      }

      if (/^[A-Z]/.test(name) && typeof module[name] === "function") {
        // class constructor
        s += "\n";
        s += indent(level) + "native class " + name + " {\n\n";
        dumpModule(module[name], "static ", level + 1);
        dumpModule(module[name].prototype, "", level + 1);
        s += "\n";
        s += indent(level) + "}\n\n";
      }
      else if (typeof module[name] == "function") {
        // class method
        var matched = module[name].toString().match(/function(?: \w*)\s*\(([^\)]*)\)/);

        var args = (matched != null ? matched[1] : "");
        if (!args && module[name].length != 0) {
          var a = [];
          for (var i = 0; i < module[name].length; ++i) {
            a.push("arg" + i);
          }
          args = a.join(", ");
        }

        s += indent(level) + prefix + "function " + name + "(" + args + ") : void;\n";
      }
      else {
        s += indent(level) + "// value = " + JSON.stringify(module[name]) + "\n";
        s += indent(level) + prefix + "var " + name + " : " + typeof(module[name]) + ";\n";
      }
    }
  }(module, "static ", 1));

  s += "\n";
  s += "} = \"require('" + file + "')\";\n\n";
  s += "// vim: set tabstop=2 shiftwidth=2 expandtab:\n";

  console.log(s);
});

// vim: set tabstop=2 shiftwidth=2 expandtab:

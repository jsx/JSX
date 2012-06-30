(function () {
  function words() {
    var w = {};
    for (var i = 0; i < arguments.length; ++i) {
      w[arguments[i]] = true;
    }
    return w;
  }

  CodeMirror.defineMIME("application/jsx", {
    name: "clike",

    keywords: words(
      "break", "continue",
      "new", "delete", "in", "instanceof", "typeof", "as", "__noconvert__",
      "return", "var", "const", "__readonly__",
      "this", "__FILE__", "__LINE__",
      "case", "default",
      "throw",
      "static", "final", "override", "native", "__fake__", "extends", "abstract",
      "function",
      "import", "from", "into",
      "_Main", "_Test",
      "debugger", "assert", "log",
      // reserved but unused: byte char double enum export float goto long package private protected public short synchronized throws transient volatile arguments

      // block keywords
      "class", "interface", "mixin",
      "if", "else", "switch",
      "while", "for", "do",
      "try", "catch", "finally"
    ),

    blockKeywords: words(
      "class", "interface", "mixin",
      "if", "else", "switch",
      "while", "for", "do",
      "try", "catch", "finally"
    ),

    atoms: words("true", "false", "null", "NaN", "Infinity"),

    builtin: words(
      "Array", "boolean", "Boolean", "Date", "number", "Number", "Map", "int", "Object", "string", "String", "RegExp", "JSON", "Nullable", "variant", "void",
      "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"
    )
  });
}());
// vim: set expandtab:
// vim: set tabstop=2:
// vim: set shiftwidth=2:

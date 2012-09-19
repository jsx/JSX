# JSX completion

The JSX compiler has the completion mode for text editors / IDEs,
triggered by `jsx --complete`.

# CAVEAT

This feature is alpha quality. Project to change.

# USAGE

`jsx --complete 15:7 complete/example.jsx` will shows the following JSON array:

```json
[
   {
      "word" : "window",
      "definedFilename" : "/path/to/jsx/lib/js/js/web.jsx",
      "definedClass" : "dom",
      "doc" : "The top-level Window object.",
      "type" : "Window",
      "definedLineNumber" : 18
   },
   {
      "args" : [
         {
            "name" : "id",
            "type" : "string"
         }
      ],
      "word" : "getElementById",
      "definedClass" : "dom",
      "definedFilename" : "/path/to/jsx/lib/js/js/web.jsx",
      "type" : "function (: string) : HTMLElement",
      "doc" : "same as <code>dom.document.getElement(id)</code>, except returns <code>HTMLElement</code>.",
      "returnType" : "HTMLElement",
      "definedLineNumber" : 35
   }
]
```

[jsx.vim](https://github.com/jsx/jsx.vim/blob/master/autoload/jsx.vim) uses this feature.

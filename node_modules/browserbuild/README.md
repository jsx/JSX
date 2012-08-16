
# Browserbuild

Browserbuild allows you to write code for the browser that leverages
`require`, `module` and `exports`, but that gets exposed as a global.

It doesn't enforce any script loaders on the user to leverage the 
compiled library.

## Example

1. Write for Node

    **lib/hithere.js**

    ```js
    var b = require('./b')

    module.exports = function () {
      alert('hello ' + b());
    }
    ```

    **lib/b.js**

    ```
    module.exports = function () {
      return 'world';
    }
    ```

2. Build for browser!

    ```bash
    $ browserbuild -m hithere `find lib -name '*.js'` > my-library.js
    ```

3. Use!

    ```html
    <script src="my-library.js"></script>
    <script>
      hithere();
    </script>
    ```

## Features

- Write code like you would write for Node.JS. 
  - No wrappers
  - No `undefined` type checking for `module` or `window`.
- No new patterns
  - No AMD, no `require.async`, no CommonJS transport proposals.
  - Doesn't depend on `require` implementations on the client.
  - It exposes your module as a single global, like `jQuery`, `io`, `_`. Just
    like everyone is used to.
- No code bloat.
  - The conversion for the browser only adds a few lines of code.
  - No trouble debugging.
- [debug](http://github.com/visionmedia/debug) integration
  - Make dev builds with debugging enabled.

## Credits

- `require` functions by [Jonah Fox](https://github.com/weepy), with
  modifications by TJ Holowaychuk &lt;tj@learnboost.com&gt;
- inspired by `browserify`

## License 

(The MIT License)

Copyright (c) 2011 Guillermo Rauch &lt;guillermo@learnboost.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

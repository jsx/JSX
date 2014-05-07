? my $context = $main::context;
? $_mt->wrapper_file("wrapper.mt")->(sub {

<title>Compiler Reference - Documents - JSX</title>

?= $_mt->render_file("header.mt")
?= $_mt->render_file("breadcrumb.mt", [ qw(Documents doc.html) ], [ "Compiler Reference" ])

<div id="main">

<p>This document describes the behaviour of the JSX compiler in detail.</p>

<h2>Options</h2>

<h3>--add-search-path <i>path</i></h3>

<p>
Adds given search path to an internal list of paths used by the compiler for searching <code>import</code>ed source files.  It is not recommended to specify paths by using references to parent directories (i.e. <code>".."</code>) since that may cause confusion in the search logic.  Repeat the option to specify more than one paths.
</p>

<h3>--run</h3>

<p>
When specified, the compiler executes the program immediately following a successfull compilation.  Implies <code>--executable node</code>.
</p>

<h3>--test</h3>

<p>
When specified, the compiler executes the unit tests defined in the source file.  For how to write tests conforming to the interface, please refer to <a href="doc/test.html">Unit tests for JSX</a>.
</p>

<h3>--executable</h3>

<p>
The option specifies the way to execute (or not to execute) the program when loaded.  If omitted, no function will be called when the compiled program is being loaded.
</p>

<dl>
<dt>--executable node</dt>
<dd>
Target platform is <a href="http://nodejs.org/">node.js</a>.  <code>_Main.main(:string[]):void</code> of the source file (that was given to the compiler as an argument) will be called right after the program is being loaded.  Command line arguments are passed to the function as the arguments.
</dd>
<dt>--executable web</dt>
<dd>
Target platform is web browsers.  <code>_Main.main(:string[]):void</code> is called when the web browser issues a <code>DOMContentLoaded</code> event.  The argument to the function will always be an empty string array.
</dd>
<dt>--executable common</dt>
<dd>
Target platform is <a href="http://www.commonjs.org/">CommonJS</a>.  The only difference from <code>--executable node</code> is that the arguments are taken from the <code>system</code> module of CommonJS, instead of from the <code>process</code> module of node.js.
</dd>
</dl>

<h3>--release</h3>

<p>
Disables run-time type checking and debug logging, enables optimizations that are known to have performance / size benefits.
</p>

<h3>--profile</h3>

<p>
Enables the profiler.  For more information please refer to <a href="profiler.html">Usisng the Profiler</a>.
</p>

<h3>--minify</h3>

<p>
Minifies the generated program.
</p>

<h3>--disable-type-check</h3>

<p>
Disables run-time type checking.  The option is automatically turned on when <code>--release</code> is used.
</p>

<h3>--optimize cmd1,cmd2,...</h3>

<p>
Specifies the optimization subcommands to be used.  Some notable subcommands are as follows.
</p>

<dl>
<dt>no-log</dt>
<dd>ignore <code>log</code> statements (implied by <code>--release</code>)</dd>
<dt>no-assert</dt>
<dd>ignore <code>assert</code> statements (implied by <code>--release</code>)</dd>
<dt>no-debug</dt>
<dd>ignore <code>debug</code> statements  (implied by <code>--release</code>)</dd>
</dl>

<p>
See <code>--help</code> for complete list of subcommands.
</p>

</div>

? })

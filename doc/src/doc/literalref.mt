? my $context = $main::context;
? $_mt->wrapper_file("wrapper.mt")->(sub {

<title>Literals - Documents - JSX</title>

?= $_mt->render_file("header.mt")
?= $_mt->render_file("breadcrumb.mt", [ qw(Documents doc.html) ], [ "Literals" ])

<div id="main">

<h2>Literals</h2>

<h3>Keywords</h3>

<p>
The table lists the keyword literals of JSX.  In contrary to JavaScript, there is no distinction between <code>undefined</code> and <code>null</code>.
</p>

<table>
<caption>Table 1. List of Keyword Literals</caption>
<tr>
<th>Keyword</th>
<th>Description</th>
</tr>
<tr>
<td nowrap><code>null [: type]</code></td>
<td>declares null, may have the type annotated.  The type is deducted (if possible) if the type annotation does not exist.</td>
</tr>
<tr>
<td><code>false</code></td>
<td>a boolean constant</td>
</tr>
<tr>
<td><code>true</code></td>
<td>a boolean constant</td>
</tr>
</table>

<h3>Number Literal</h3>

<p>
Identical to JavaScript in strict mode.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
var a = 10;
var b = 3.14;
var c = 0xCafe;
EOT
?>
<h3>String Literal</h3>

<p>
Identical to JavaScript.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
var a = "foo\n";
var b = 'bar\n';
var c = "\x5c";   // ascii escape
var d = "\u005C"; // unicode escape
EOT
?>

<h3>RegExp Literal</h3>

<?= $context->{prettify}->('jsx', <<'EOT')
var a = /foo/;
var b = /[a-zA-Z0-9]+/;
EOT
?>

<p>
Identical to JavaScript.
</p>

<h3>Function Literal</h3>

<p>
Type annotations against arguments and return types are required for function declaration, unless the type can be deducted by the surrounding expression.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
// a function that takes no arguments, and returns void
var f = function () : void {};

// a function that takes one argument (of number),
// and returns a number that in incremented by one
var g = function (n : number) : number {
    return n + 1;
};

// the argument types and return types may be omitted
// (if it is deductable from the outer expression)
var sum = 0;
[ 1, 2, 3 ].forEach(function (e) {
    sum += e;
});
log sum; // 6

// short-handed
var sum = 0;
[ 1, 2, 3 ].forEach((e) -> { sum += e; });
log sum; // 6

// short-handed, single-statement function expression
var s = "a0b1c".replace(/[a-z]/g, (ch) -> ch.toUpperCase());
log s; // A0B1C
EOT
?>

<p>
A statement starting with <code>function</code> is parsed as an inner function declaration, as is by JavaScript. Surround the function declaration with <code>()</code> if your intention is to create an anonymous function and call it immediately.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
// inner function declaration (when used within a function declaration)
function innerFunc() : void {
    ...;
}

// create an anonymous function and execute immediately
(function () : void {
    ...;
})();
EOT
?>

<p>
See also: <i>Member Function</i> in <a href="doc/class.html">Class, Interface, and Mixin</a>.
</p>

<h3>Array Literal</h3>

<p>
Array literal is identical to JavaScript except
that it may have type annotations if its value type is not deduced.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
// empty array literals require an explicit type
var a = [] : string[];
// the type is clear; you can omit type declaration
var b : string[] = [];

function f(a : string[]) : void { }
// the type is also clear
f([]);

// the type is number[] because it has a number as an element
var c = [1];

// trailing commas are allowed
var d = [
  "foo",
  "bar",
  "baz",
];
EOT
?>

<h3>Map Literal</h3>

<p>Map literal is identical to JavaScript except
that it may have type annotations if its value type is not deduced.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
// empty array literals require an explicit type
var a = {} : Map.<string>;
// the type is clear; you can omit type declaration
var b : Map.<string> = {};

function f(a : string[]) : void { }
// the type is also clear
f({});

// the type is Map.<number> because it has a number as an element
var c = { foo: 1 };

// trailing commas are allowed
var d = {
  foo: "foo",
  bar: "bar",
  baz: "baz",
};
EOT
?>

</div>

? })

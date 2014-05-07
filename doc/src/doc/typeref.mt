? my $context = $main::context;
? $_mt->wrapper_file("wrapper.mt")->(sub {

<title>Types - Documents - JSX</title>

?= $_mt->render_file("header.mt")
?= $_mt->render_file("breadcrumb.mt", [ qw(Documents doc.html) ], [ "Types" ])

<div id="main">

<h2>Primitive Types</h2>

<p>JSX provides the following four primitive types. Primitive types are non-nullable.</p>

<ul>
<li><code>boolean</code></li>
<li><code>number</code></li>
<li><code>string</code></li>
<li><code>(int)</code></li>
</ul>

<p><code>Int</code> (represents 32-bit signed integer) exists as a type, but variables (or properties or constants) of the type are generated only when the type is specified explicitly (i.e. <code>var n = 1;</code> defines a variable <code>n</code> of type <code>number</code>, <code>var i : int = 1;</code> defines a variable <code>i</code> of type <code>int</code>).  This is due to the fact that the use of <code>int</code> may lead to slower execution speed.</p>

<h2>Nullable Primitive Types</h2>

<p>A nullable counterpart exists for each primitive type.  Values of the types are returned by [] operators of <code>Array.&lt;primitive_type&gt;</code> and <code>Map.&lt;primitive_type&gt;</code>.</p>

<ul>
<li><code>Nullable.&lt;boolean&gt;</code></li>
<li><code>Nullable.&lt;number&gt;</code></li>
<li><code>Nullable.&lt;string&gt;</code></li>
<li><code>(Nullable.&lt;int&gt;)</code></li>
</ul>

<h2>Variant Type</h2>

<p>
A <code>variant</code> can hold any type of data (including <code>null</code>). To use the data, explicit cast to other data types is necessary.
</p>

<h2>Built-in Object Types</h2>

<h3>Object</h3>

<p><code>Object</code> class is the root class for all objects.</p>

<h3>Array.&lt;T&gt;</h3>

<p>The class represents an array, by providing the <code>[]</code> operator that takes a number as the argument, <code>length</code> property and other methods to manipulate the array.  In contrast to JavaScript, the array is typed.  An instance of <code>Array.&lt;T&gt;</code> class may only store elements of type <code>T</code> or <code>null</code>.</p>

<p>The size of the array automatically grows.  <code>null</code> is returned when an element out of the current boundary is requested.</p>

<p>There are two ways to create an array object; one is to use the <code>new</code> opreator, the other is to use the array initialiser.  The type of the array returned by an array initialiser is deducted from the type of the elements.  Type information should be annotated in cases where such deduction is impossible (such as when initializing an empty array).</p>

<?= $context->{prettify}->('jsx', <<EOT)
new Array.<number>;         // creates an empty array of numbers
new Array.<number>(length); // creates an array of given length (elements are initialized to null)
[] : Array.<number>;        // creates an empty array of numbers
[ 1, 2, 3 ];                // creates an array of numbers with three elements: 1, 2, 3
EOT
?>

<h3>Map.&lt;T&gt;</h3>

<p>The class represents an associative array (collection of key-values pairs), mapping <code>string</code>s to values of type <code>T</code> or <code>null</code>.</p>

<p>Operator <code>[]</code> (that takes a <code>string</code> as the argument) is provided for registering / retreiving a keyed value.  <code>for..in</code> statement can be used for iterating the keys.  <code>hasOwnProperty</code> method is provided for checking whether or not a key-value pair of a particular name is registered.  The <code>delete</code> statement can be used for unregistering a key-value pair.</p>

<p>Map objects can be created in two ways; by using the <code>new</code> operator or by using the map initialiser.</p>

<?= $context->{prettify}->('jsx', <<EOT)
new Map.<number>;  // creates an empty map of strings to numbers
{} : Map.<number>; // same as above
{ a: 1 };          // creates a map of strings to numbers that has one pair: ("a" => 1)
EOT
?>

<h3>Boolean, Number, String</h3>

<p>Internal types used for applying methods against primitives.</p>

<p>These types of objects are instantiated when applying the dot operator against the primitives.  For exmaple, the following code snippet applies the operator against string <code>"abc"</code>, that returns a <code>String</code> object wrapping the primitive value.  Then the <code>charAt</code> method of the object is called and <code>"a"</code> (of type <code>string</code>) is returned.</p>

<?= $context->{prettify}->('jsx', <<EOT)
"abc".charAt(0) // returns "a"
EOT
?>

<p>Although being possible, it is discouraged to instantiate and store these values of the types (e.g. <code>var s = new String("abc")</code>).  Use of the primitive types (or nullable primitive types) is preferable for performance and debugging reasons.</p>

<p><code>Number</code> and <code>String</code> classes also provide some useful class methods and constants, e.g. <code>Number.parseInt(:string):number</code>, <code>String.encodeURIComponent(:string):string</code>.</p>

<h3>JSX</h3>

<p>The class provides some methods for controlling the runtime environment.</p>

<h2>User-defined Types</h2>

<p>
Users may define a new class by extending the <code>Object</code> class, or by declaring an interface or a mixin. See <a href="doc/class.html">Class, Interface and Mixin</a>.
</p>

</div>

? })

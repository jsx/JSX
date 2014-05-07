? my $context = $main::context;
? $_mt->wrapper_file("wrapper.mt")->(sub {

<title>Importing Files - Documents - JSX</title>

?= $_mt->render_file("header.mt")
?= $_mt->render_file("breadcrumb.mt", [ qw(Documents doc.html) ], [ "Importing Files" ])

<div id="main">

<h2>Importing Files</h2>

<p>
By using the import statement, it is possible to refer to classes defined in other source files.

The statement has several variations. All the import statement must appear before the first class (or interface or mixin) declaration within the source file.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
// import all classes that do not start with "_" from "a.jsx"
import "a.jsx";

// import two classes C1 and _Internal from "a.jsx"
import C1, _Internal from "a.jsx";

// import all classes that do not start with "_" under prefix A
import "a.jsx" into A; // class C1 of a.jsx can be referred to as: A.C1

// import all files under directory "sub"
import "sub/*.jsx";
EOT
?>

<p>
Note: JSX does not use a hierarchical namespace model. It instead adopts per-source file namespace model, which can also be found in Python and node.js.
</p>

</div>

? })

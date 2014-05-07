? my $context = $main::context;
? $_mt->wrapper_file("wrapper.mt")->(sub {

<title>Class, Interface and Mixin - Documents - JSX</title>

?= $_mt->render_file("header.mt")
?= $_mt->render_file("breadcrumb.mt", [ qw(Documents doc.html) ], [ "Class, Interface and Mixin" ])

<div id="main">

<h2>Class, Interface and Mixin</h2>

<p>
A class in JSX have following characteristics.
</p>

<ul>
<li>all classes derive from the built-in <code>Object</code> class</li>
<li>single inheritance using the extends keyword</li>
<li>more than one interfaces and mixins can be implemented using the implements keyword</li>
</ul>

<p>
For example, <code>class E extends A implements C, D</code> means: <code>C</code> can override members of A (*1), <code>D</code> can override members of the production of *1 (*2), and that <code>E</code> can override members of the production of *2.
</p>

<p>
A class may have the attributes listed in Table 1.
</p>

<table>
<caption>Table 1. Class Attributes</caption>
<tr><th>Name</th><th>Description</th></tr>
<tr>
<td>abstract</td>
<td>a class with abstract methods should have the attribute set</td>
</tr>
<tr>
<td>final</td>
<td>declares that the class may not be extended</td>
</tr>
</table>

<p>
An user-defined class may have zero ore more functions or variables.
</p>

<p>
The example below defines a class called <code>Human</code> with a member variable <code>_name</code>, constructor function that takes a string as an argument, and a non-static member function (i.e. method) called <i>say</i>, that does not take any arguments and returns void).
<p>

<?= $context->{prettify}->('jsx', <<'EOT')
class Human {
    var _name : string;
    function constructor(name : string) {
        this._name = name;
    }
    function say() : void {
        log "My name is " + this._name;
    }
}
EOT
?>

<h3>Member Function</h3>

<p>
A member function is defined by either of the following form. Arguments should have their types being annotated. The default value may follow the type annotation, which will be evaluated in the function scope in runtime. The type after the closing parenthesis at the end of the argument list designates the return type of the function. Function that is not attributed <code>abstract</code> or <code>native</code> should have body. Function that is attributed <code>abstract</code> may have body.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
// function with body
attribute* function funcname([arg1 : type [= defaultValue] [, arg2 : type, ...]]) : type { statement* }

// function without body
attribute* function funcname([arg1 : type[, arg2 : type, ...]]) : type;
EOT
?>

<p>
A function may have the attributes listed in Table 2.
</p>

<table>
<caption>Table 2. Attributes of a Member Function</caption>
<tr><th>Name</th><th>Description</th></tr>
<tr>
<td>abstract</td>
<td>declares that the function should be overridden by a class that extends the class</td>
</tr>
<tr>
<td>final</td>
<td>declares that the function may not be overridden</td>
</tr>
<tr>
<td>static</td>
<td>declares that the function is static</td>
</tr>
<tr>
<td>override</td>
<td>declares that the definition of the function is overriding an definition in the extended class (or implemented interface or mixin). A function overriding an existing function should have the attribute set.</td>
</tr>
</table>

<h3>Member Variable</h3>

<p>
A member variable is defined in the following form. For ordinary variables, either the type or the expression should be specified. For constants, expression is mandatory and type is optional.
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
// ordinary variable
attribute* var varname [: type][ = expression];

// constant
static const CONSTNAME [: type] = expression;
EOT
?>

<p>
An ordinary member variable may have the attributes listed in Table 3.
<p>

<table>
<caption>Table 3. Attributes of a Member Variable</caption>
<tr><th>Name</th><th>Description</th></tr>
<tr>
<td>abstract</td>
<td>declares that the variable should be defined in a class that extends the class</td>
</tr>
<tr>
<td>static</td>
<td>declares that the variable is static</td>
</tr>
</table>

<h3>Referring to Members</h3>

<p>
Member functions and variables can be referred to by applying the "." operator against a class name (for static members) or against a variable of the class type (or <code>this</code>).
</p>

<?= $context->{prettify}->('jsx', <<'EOT')
// refers to a static variable
_Klass_.static_var

// calls a static function
_Klass_.static_func(...)

// refers to a non-static variable
_instance_.var
this.var // only within a non-static function

// calls a non-static function (i.e. method)
_instance_.func()
this.func() // only within a non-static function
EOT
?>

<h2>Interface</h2>

<p>
An interface in JSX is similar to that of Java, except for the fact that it may have abstract variables. All the non-static functions are implicitly marked as <code>abstract</code>, and they cannot have bodies. An interface may <em>implement</em> other intefaces.
</p>

<h2>Mixin</h2>

<p>
Mixin is provided so that implementations can be shared between classes. Mixins may <em>implement</em> interfaces or other mixins. It may have functions with body or non-abstract variables.
</p>

</div>

? })

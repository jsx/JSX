? my $context = $main::context;
? $_mt->wrapper_file("wrapper.mt")->(sub {

<style type="text/css">
#main th,td {
    afont-size: 70%;
}
</style>

<title>Type Conversion - Documents - JSX</title>

?= $_mt->render_file("header.mt")
?= $_mt->render_file("breadcrumb.mt", [ qw(Documents doc.html) ], [ "Type Conversion" ])

<div id="main">

<h2>Type Conversion</h2>

<p>
The as operator is used for: conversion between primitive types (including Nullable and variant), down-casting of object types.
</p>

<p>
The conversion rules between primitive types are defined as follows. If the source type is a Nullable type and if the value is null, a run-time exception is raised under debug builds. The behavior is unspecified for release builds.
</p>

<p>
The result of conversion from a variant type depends on the result of the typeof operator applied to the variant.
</p>

<p>
Down-casting of an object type returns a reference to the casted object if successful, otherwise null.
</p>

<table>
<caption>Table 1. Conversion between the Primitive Types using the <i>As</i> Operator</caption>
<tr><th>Source Type</th><th>Destination Type</th><th>Result</th></tr>
<tr><td>boolean</td><td>number</td><td>0 if false, 1 if true</td></tr>
<tr><td>boolean</td><td>int</td><td>same as above</td></tr>
<tr><td>boolean</td><td>string</td><td>"false" if false, "true" if true</td></tr>
<tr><td>number</td><td>boolean</td><td>false if 0 or NaN, otherwise true</td></tr>
<tr><td>number</td><td>int</td><td>fractional part is removed, becomes 0 if NaN, may get rounded to between -2<sup>31</sup> and 2<sup>31</sup>-1</td></tr>
<tr><td>number</td><td>string</td><td>converted to string representation</td></tr>
<tr><td>int</td><td>boolean</td><td>false if 0, otherwise true</td></tr>
<tr><td>int</td><td>number</td><td>converted to number of same value</td></tr>
<tr><td>int</td><td>string</td><td>converted to string representation</td></tr>
<tr><td>string</td><td>boolean</td><td>false if the string is empty, otherwise true</td></tr>
<tr><td>string</td><td>number</td><td>0 if the string is empty, a number if the string can be parsed as a string, otherwise NaN</td></tr>
<tr><td>string</td><td>int</td><td>equivalent to: as number as int</td></tr>
</table>

<table>
<caption> Table 2. Conversion from Variant using the <i>As</i> Operator</caption>
<tr><th>Result of typeof(variant)</th><th>Destination Type</th><th>Result</th></tr>
<tr><td>"undefined"</td><td>boolean</td><td>false</td></tr>
<tr><td>"undefined"</td><td>number</td><td>NaN</td></tr>
<tr><td>"undefined"</td><td>int</td><td>0</td></tr>
<tr><td>"undefined"</td><td>string</td><td>"undefined"</td></tr>
<tr><td>"null"</td><td>boolean</td><td>false</td></tr>
<tr><td>"null"</td><td>number</td><td>0</td></tr>
<tr><td>"null"</td><td>int</td><td>0</td></tr>
<tr><td>"null"</td><td>string</td><td>"null"</td></tr>
<tr><td>"boolean"</td><td>any primitive type</td><td>equivalent to the result of: boolean as type</td></tr>
<tr><td>"number"</td><td>any primitive type</td><td>equivalent to the result of: number as type</td></tr>
<tr><td>"string"</td><td>any primitive type</td><td>equivalent to the result of: string as type</td></tr>
<tr><td>"object"</td><td>any primitive type</td><td>depends on the actual type of the value</td></tr>
<tr><td>"object"</td><td>any object type</td><td>reference to the object if the value is an object of the specified type, otherwise null</td></tr>
</table>

</div>

? })

? $_mt->wrapper_file("wrapper.mt")->(sub {

<title>Page not Found - JSX</title>

?= $_mt->render_file("header.mt", "doc")

<div id="main">

<p style="text-align: center; margin: 5em 0;">
The requested document does not exist.
</p>

</div>

? })

<?
my $context = $main::context;

$context->{filename} =~ m{^([^\./]*)};
my $cur_tab = $1;
my $selected = Text::MicroTemplate::encoded_string(q{ class="selected"});
?>
</head>
<body>
<div id="body">
<div id="top">
<h1><a href="./">JSX</a></h1>
a faster, safer, easier JavaScript

<!-- oktavia -->
<form id="searchform">
<input class="search" type="search" name="search" id="search" results="5" value="" placeholder="Search" />
<div id="searchresult_box">
<div id="close_search_box">&times;</div>
<div id="searchresult_summary"></div>
<div id="searchresult"></div>
<div id="searchresult_nav"></div>
<span class="pr">Powered by <a href="https://github.com/shibukawa/oktavia">Oktavia</a></span>
</div>
</form>
<!-- /oktavia -->

</div>
<table id="menu">
<tr>
<td><a href="try-on-web/" target="_blank">Try</a></td>
<td><a href="https://github.com/jsx/JSX/" target="_blank">Repository</a></td>
<td<?= $cur_tab eq "doc" ? $selected : '' ?>><a href="doc.html">Documents</a></td>
<td<?= $cur_tab eq "faq" ? $selected : '' ?>><a href="faq.html">FAQ</a></td>
</tr>
</table>

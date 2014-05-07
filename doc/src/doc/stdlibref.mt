? my $context = $main::context;
? $_mt->wrapper_file("wrapper.mt")->(sub {
? my $title = "Built-in and standard class libraries";
<title><?= $title ?> - Documents - JSX</title>
?= $_mt->render_file("header.mt");
?= $_mt->render_file("breadcrumb.mt", [ qw(Documents doc.html) ], [$title]);

<div id="main">

<h2><?= $title ?></h2>
<ul>
<?
use File::Find;

sub to_show {
  my($name) = @_;
  $name =~ s{^.*jsxdoc/}{};
  $name =~ s{\.html$}{};
  return $name;
}

find {
    wanted => sub {
        return if -d $_;
        return unless /\.html$/;
?>
<li><a href="/<?= $_  ?>"><?= to_show($_) ?></a></li>
<?
    },
    no_chdir => 1,
}, '../jsxdoc';
?>
</ul>
</div>

? })

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

sub to_link {
  my ($path) = @_;
  $path =~ s{^.*jsxdoc/}{jsxdoc/};
  return $path;
}

sub to_name {
  my ($path) = @_;
  my $name = to_link($path);
  $name =~ s{\.html$}{};
  return $name;
}

find {
    wanted => sub {
        return if -d $_;
        return unless /\.html$/;
?>
<li><a href="<?= to_link($_)  ?>"><?= to_name($_) ?></a></li>
<?
    },
    no_chdir => 1,
}, 'jsx.github.com/jsxdoc';
?>
</ul>
</div>

? })

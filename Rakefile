
task :default => [ :test ]

file 'jsx.js' => [ 'jsx.pegjs' ] do
    sh 'node_modules/.bin/pegjs', 'jsx.pegjs'
end

task :test => [ 'jsx.js', 'parse.js' ] do
    sh 'node', 'parse.js', 'example/hello.jsx';
end



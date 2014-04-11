REM This batch file assumes https://code.google.com/p/msysgit/ and node.js for Windows is installed.
REM Before running this batch file, run "git submodules update --init"

perl submodules\picotemplate\picotemplate.pl src/_doc.jsx
perl tool\make-meta package.json src/meta.jsx
cd src
node ..\tool\bootstrap-compiler.js --executable node --warn none --output ..\bin\jsx jsx-node-front.jsx
cd ..
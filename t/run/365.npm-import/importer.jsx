import "nomain-dirlib";                // if there is 'index.jsx' at folder root, read that file
import "main";                         // if there is 'package.json' and 'main' section, read that file
import "nomain-dirlib/child-lib.jsx";  // if there is 'package.json' and directories.lib' seciton, search file from there

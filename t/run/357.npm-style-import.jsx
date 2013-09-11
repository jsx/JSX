/*EXPECTED
load success
load success
load success
load success
*/

import "357.single.jsx";              // search node_modules;
import "357.module";                  // if there is 'index.jsx' at folder root, read that file
import "357.module_main";             // if there is 'package.json' and 'main' section, read that file
import "357.module/child-lib.jsx";    // if there is 'package.json' and directories.lib' seciton, search file from there

class _Main {
  static function main(args : string[]) : void {
    log SingleLib.status;
    log ModuleIndexJSX.status;
    log ModuleMain.status;
    log ModuleChildLib.status;
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:

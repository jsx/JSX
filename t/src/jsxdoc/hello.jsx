/***
 * Module Description
 */

/**
 * Class Description
 */
class MyClass {
  /**
   * Instance Variable
   */
  var instanceVariable = "x";

  /**
   * Class Variable
   */
  static var classVariable = "x";

  /**
   * Constructor
   */
  function constructor() {
  }

  /**
   * Static Method
   * @param args List of Strings
   */
  static function staticMethod(args : string[] = null) : void {
    log "Hello, world!";
  }

  /**
   * Instance Method
   * @param args List of Numbers
   */
  function instanceMethod(args : number[]) : void {
    log "Hello, world!";
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


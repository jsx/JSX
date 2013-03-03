/***
 * An example to use class templates
 */

class Queue.<T> {
  var _buf = new Array.<T>;

  function constructor() { }

  function enqueue(value : T) : void {
    this._buf.push(value);
  }

  function dequeue() : T {
    if (this.isEmpty()) {
      throw new Error("empty queue");
    }
    return this._buf.shift();
  }

  function isEmpty() : boolean {
    return this._buf.length == 0;
  }
}

class _Main {
  static function main(args : string[]) : void {
    var queue = new Queue.<string>;
    queue.enqueue("foo");
    queue.enqueue("bar");

    log queue.dequeue();
    log queue.dequeue();
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:


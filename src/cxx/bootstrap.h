/* -*- mode: c++ -*- */

#include <gc_cpp.h>
#include <vector>

namespace JSX {

  class Error;
  class NotImplementedError;

  typedef double number;
  typedef bool boolean;

  class string {
  public:
    string ()
      : length_(0)
      , data_("") {
    }
    string (const char *data)
      : data_(data)
      , length_(strlen(data)) {
    }
  private:
    int length_;
    const char *data_;
  };

  template<typename T>
  class Nullable {
  public:
    Nullable (T value)
      : isNull_(false)
      , value_(value) {
    }
    Nullable ()
      : isNull_(true) {
    }
    operator T () const {
      if (isNull_) {
	throw new Error("null access");
      }
      return value_;
    }
  private:
    boolean isNull_;
    T value_;
  };

  class variant;

  class Object {
  public:
    virtual string toString () {
      return "[object Object]";
    }
  };

  class Function : public Object {
  private:
    Function() {}
  };

  template<typename T>
  class Array : public Object {
  public:
    Array ()
      : Array(0) {
    }
    Array (number length)
      : length_(length)
      , ary_(length) {
    }

    string toString () const {
      throw new NotImplementedError();
    }

    string toLocaleString () const {
      throw new NotImplementedError();
    }

  private:
    number length_;
    std::vector<T> ary_;
  };

  class Error : public Object {
  public:
    Error ()
      : name()
      , message()
      , stack() {
    }

    explicit Error (string message)
      : name()
      , message(message)
      , stack() {
    }

    string name;
    string message;

    string stack;
  };

  class NotImplementedError : public Error {
  };

}

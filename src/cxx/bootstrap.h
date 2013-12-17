/* -*- mode: c++ -*- */

#include <gc_cpp.h>
#include <vector>
#include <iostream>

namespace JSX {

  typedef double number;
  typedef bool boolean;

  class string {
  public:
    string () : length_(0), data_("") {}
    string (const char* data) : length_(strlen(data)), data_(data) {}
    operator const char* () const { return data_; }
  private:
    int length_;
    const char* data_;
  };

  template<typename T>
  class Nullable {
  public:
    Nullable () : isNull_(true) {}
    Nullable (T value) : isNull_(false), value_(value) {}
    operator T& () const;
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
      : length_(0)
      , ary_(0) {
    }
    Array (number length)
      : length_(length)
      , ary_(length) {
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

    explicit Error (const string& message)
      : name()
      , message(message)
      , stack() {
    }

    string name;
    string message;

    string stack;
  };

  template<typename T>
  Nullable<T>::operator T& () const {
    if (isNull_) {
      throw new Error("null access");
    }
    return value_;
  }

  class console : public Object {
  public:
    static void log (string str) {
      std::cout << (const char *)str << std::endl;
    }
  };

}

/* -*- mode: c++ -*- */

#include <gc_cpp.h>
#include <vector>

namespace JSX {

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

  class variant {
  public:
    enum jsx_tt {
      JSX_STRING_T,
      JSX_NUMBER_T,
      JSX_BOOLEAN_T,
      JSX_OBJECT_T,
      JSX_FUNCTION_T,
    } tt;
    union {
      number num;
      string str;
      boolean b;
      Object *obj;
    } u;
  };

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

}

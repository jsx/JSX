/* -*- mode: c++ -*- */

#include <gc_cpp.h>
#include <deque>
#include <iostream>
#include <sstream>
#include <cmath>

namespace JSX {

  typedef double number;
  typedef bool boolean;

  class string {
  public:
    string () : string("") {}
    string (const char* data) : length_(strlen(data)), data_(data) {}
    string (number n);
    operator const char* () const { return data_; }
    string operator + (const string& rhs) const;
  private:
    int length_;
    const char* data_;
  };

  string operator + (const char *lhs, const string& rhs);

  template<typename T>
  class Nullable {
  public:
    Nullable () : isNull_(true) {}
    Nullable (T value) : isNull_(false), value_(value) {}
    operator T& ();
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
    Array () : Array(10) {}
    Array (number length)
      : length(length)
      , ary_(length) {
    }
    void push(T t);
    Nullable<T> shift();
    number length;

  private:
    std::deque<Nullable<T>> ary_;
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

  string::string(number n) {
    std::stringstream ss;
    ss << n;
    const char *data = ss.str().c_str();
    length_ = strlen(data);
    data_ = data;
  }

  string string::operator +(const string& rhs) const {
    char *data = new char[length_ + rhs.length_];
    strcpy(data, data_);
    strcpy(data + length_, rhs.data_);
    return string(data);
  }

  string operator + (const char *lhs, const string& rhs) {
    return string(lhs) + rhs;
  }

  template<typename T>
  Nullable<T>::operator T& () {
    if (isNull_) {
      throw new Error("null access");
    }
    return value_;
  }

  template<typename T>
  void Array<T>::push(T t) {
    ary_.push_back(t);
    length++;
  }

  template<typename T>
  Nullable<T> Array<T>::shift() {
    Nullable<T> first = ary_[0];
    ary_.pop_front();
    length--;
    return first;
  }

  class console : public Object {
  public:
    static void log (string str) {
      std::cout << (const char *)str << std::endl;
    }
  };

}

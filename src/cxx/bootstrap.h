/* -*- mode: c++ -*- */

#include <gc_cpp.h>
#include <deque>
#include <functional>
#include <iostream>
#include <sstream>
#include <cmath>

namespace JSX {

  typedef double number;
  typedef bool boolean;
  using std::function;

  class string;
  class Object;

  string toString(Object* obj);
  string toString(const string& str);
  string toString(number num);

  class string {
  public:

    string () : string("") {
    }

    string (const char* data) :
      length_(strlen(data)),
      data_(data) {
    }

    string (number n);

    operator const char* () const {
      return data_;
    }

    string operator+ (const string& rhs) const;

  private:

    int length_;
    const char* data_;

  };

  string operator+ (const char *lhs, const string& rhs);

  class variant;

  class Object {
  public:

    virtual string toString () {
      return "[object Object]";
    }

  };

  class Function : public Object {
  private:

    Function() {
    }

  };

  class Error : public Object {
  public:

    string name;
    string message;
    string stack;

    Error () :
      name(),
      message(),
      stack() {
    }

    explicit Error (const string& message) :
      name(),
      message(message),
      stack() {
    }

  };

  template<typename T> class Nullable {
  public:

    Nullable () :
      isNull_(true) {
    }

    Nullable (const T& value) :
      isNull_(false),
      value_(value) {
    }

    operator T& () {
      if (isNull_) {
	throw new Error("null access");
      }
      return value_;
    }

  private:

    boolean isNull_;
    T value_;

  };

  template<typename T> class Nullable<T*> {
  public:

    Nullable () :
      value_(nullptr) {
    }

    Nullable (T* value) :
      value_(value) {
    }

    operator T& () {
      if (value_ == nullptr) {
	throw new Error("null access");
      }
      return *value_;
    }

  private:

    T* value_;

  };

  /**
   * <p>Array is a sequence of Nullable.&lt;T&gt; values.  The size of an array is not fixed.</p>
   * <p>Unless otherwise noted, the defintions of the methods match those specified in ECMA-262, 3rd edition.</p>
   */
  template<typename T> class Array : public Object {
  public:

    /**
     * Constructs an empty array.
     */
    Array () : Array(0) {
    }

    /**
     * Constructs an array of given length.  The elements are initialized to null.
     */
    Array (number length) : length(length), ary_(length) {
    }

    Nullable<T> operator[] (number n) const;

    /**
     * Returns a string representing the object.
     */
    string toString() override;

    /**
     * Returns a string representing the object.
     */
    string toLocaleString();

    /**
     * Returns a new array comprised of this array joined with other array(s) and/or value(s).
     *
     * @param arrayN Arrays to concatenate to the resulting array.
     */
    template<typename... Args> Array<T> concat(const Args&... arrayN) const;

    /**
     * Joins all elements of an array into a string, separating each element with a comma.
     */
    string join();

    /**
     * Joins all elements of an array into a string.
     *
     * @param separator Specifies a string to separate each element of the array.
     */
    string join(const string& separator);

    /**
     * Removes the last element from an array and returns that element.
     *
     * @return The last element of the array that has been removed, or null if the array was empty.
     */
    Nullable<T> pop();

    /**
     * Mutates an array by appending the given elements and returning the new length of the array.
     *
     * @param itemN The elements to add to the end of the array.
     */
    template<typename... Args> int push(const Args&... itemN);

    /**
     * Reverses an array in place.  The first array element becomes the last and the last becomes the first.
     *
     * @return Returns reference to itself.
     */
    Array<T> reverse();

    /**
     * Removes the first element from an array and returns that element. This method changes the length of the array.
     *
     * @return The first element of the array that has been removed, or null if the array was empty.
     */
    Nullable<T> shift();

    /**
     * Returns a one-level deep copy of a portion of an array.
     *
     * @param start Zero-based index at which to begin extraction.
     */
    Array<T> slice(number start) const;

    /**
     * Returns a one-level deep copy of a portion of an array.
     *
     * @param start Zero-based index at which to begin extraction.
     * @param end Zero-based index at which to end extraction. slice extracts up to but not including end.
     */
    Array<T> slice(number start, number end) const;

    /**
     * Sorts the elements of an array in place and returns the array.
     * The sort is not necessarily stable.
     * The array is sorted lexicographically (in dictionary order) according to the string conversion of each element.
     */
    Array<T> sort();

    /**
     * Sorts the elements of an array in place and returns the array.
     * The sort is not necessarily stable.
     *
     * @param comparefn Specifies a function that defines the sort order.
     */
    Array<T> sort(function<number(Nullable<T>, Nullable<T>)> comparefn);

    /**
     * Changes the content of an array, adding new elements while removing old elements.
     *
     * @param start Index at which to start changing the array. If negative, will begin that many elements from the end.
     * @param deleteCount An integer indicating the number of old array elements to remove.
     * @param itemN The elements to add to the array.  If you don't specify any elements, <code>splice</code> simply removes elements from the array.
     *
     * @return An array containing the removed elements. If only one element is removed, an array of one element is returned.
     */
    template<typename... Args> Array<T> splice(number start, number deleteCount, const Args&... itemN);

    /**
     * Adds one or more elements to the beginning of an array and returns the new length of the array.
     *
     * @param itemN The elements to add to the front of the array.
     * @return The new <code>length</code> property of the object upon which the method was called.
     */
    template<typename... Args> int unshift(const Args&... itemN);

    // 15.4.4 (ES5)
    /**
     * Returns the first index at which a given element can be found in the
     * array, or -1 if it is not present.
     */
    number indexOf(Nullable<T> value, number fromIndex = 0) const;

    /**
     * Returns the last index at which a given element can be found in the
     * array, or -1 if it is not present. The array is searched backward.
     */
    number lastIndexOf(Nullable<T> value, number fromIndex = 0) const;

    /**
     * Tests whether all elements in the array pass the test implemented by
     * the provided function.
     *
     * @callbackfn A function to test for each element.
     */
    boolean every(function<boolean(Nullable<T>)> callbackfn);
    boolean every(function<boolean(Nullable<T>, number)> callbackfn);
    boolean every(function<boolean(Nullable<T>, number, Array<T>)> callbackfn);

    /**
     * Tests whether some element in the array passes the test implemented
     * by the provided function.
     */
    boolean some(function<boolean(Nullable<T>)> callbackfn);
    boolean some(function<boolean(Nullable<T>, number)> callbackfn);
    boolean some(function<boolean(Nullable<T>, number, Array<T>)> callbackfn);

    /**
     * Calls callbackfn once for each element in the array, in ascending
     * order.
     *
     * @param callbackfn A function to call for each element.
     */
    void forEach(function<void(Nullable<T>)> callbackfn);
    void forEach(function<void(Nullable<T>, number)> callbackfn);
    void forEach(function<void(Nullable<T>, number, Array<T>)> callbackfn);

    /**
     * Creates a new array with the results of calling a provided function
     * on every element in this array.
     *
     * @param callbackfn A function that produces an element of the new
     *        <code>Array.&lt;U&gt;</code> from an element of the current one.
     */
    template<typename U> Array<U> map(function<Nullable<U>(Nullable<T>)> callbackfn);
    template<typename U> Array<U> map(function<Nullable<U>(Nullable<T>, number)> callbackfn);
    template<typename U> Array<U> map(function<Nullable<U>(Nullable<T>, number, Array<T>)> callbackfn);

    /**
     * Creates a new array with all elements that pass the test implemented
     * the provided function.
     *
     * @param callbackfn A function to test each elements of the array.
     */
    Array<T> filter(function<boolean(Nullable<T>)> callbackfn);
    Array<T> filter(function<boolean(Nullable<T>, number)> callbackfn);
    Array<T> filter(function<boolean(Nullable<T>, number, Array<T>)> callbackfn);

    /**
     * Apply a function against an accumulator and each value of the array
     * (from left-to-right) as to reduce it to a single value.
     *
     * <code>reduce</code> will throw <code>TypeError</code> if the array
     * contains no elements and no initialValue is suplied.
     *
     * @param callbackfn A function to execute on each value in the element,
     *        taking four arguments: the previousValue (the value previously
     *        returned in the last invocation of the callback), the
     *        currentValue (the current element being processed in the array),
     *        the currentIndex and the array.
     */
    template<typename U> U reduce(function<U(Nullable<U>, Nullable<T>)> callbackfn);
    template<typename U> U reduce(function<U(Nullable<U>, Nullable<T>, number)> callbackfn);
    template<typename U> U reduce(function<U(Nullable<U>, Nullable<T>, number, Array<T>)> callbackfn);
    template<typename U> U reduce(function<U(Nullable<U>, Nullable<T>)> callbackfn, U initialValue);
    template<typename U> U reduce(function<U(Nullable<U>, Nullable<T>, number)> callbackfn, U initialValue);
    template<typename U> U reduce(function<U(Nullable<U>, Nullable<T>, number, Array<T>)> callbackfn, U initialValue);

    /**
     * Apply a function simultaneously against two values of the array
     * (from right-to-left) as to reduce it to a single value.
     */
    template<typename U> U reduceRight(function<U(Nullable<U>, Nullable<T>)> callbackfn);
    template<typename U> U reduceRight(function<U(Nullable<U>, Nullable<T>, number)> callbackfn);
    template<typename U> U reduceRight(function<U(Nullable<U>, Nullable<T>, number, Array<T>)> callbackfn);
    template<typename U> U reduceRight(function<U(Nullable<U>, Nullable<T>)> callbackfn, U initialValue);
    template<typename U> U reduceRight(function<U(Nullable<U>, Nullable<T>, number)> callbackfn, U initialValue);
    template<typename U> U reduceRight(function<U(Nullable<U>, Nullable<T>, number, Array<T>)> callbackfn, U initialValue);

    /**
     * <p>A positive integer between 0 and a value less than 2<sup>32</sup> that specifies the number of elements in an array.</p>
     *
     * <p>You can set the length property to truncate an array at any time. When you extend an array by changing its length property, the created elements are initialized to null.</p>
     */
    number length;

  private:

    std::deque<Nullable<T>> ary_;

    int push_();

    template<typename... Args> int push_(const Nullable<T>& t, const Args&... itemN);

  };

  class console : public Object {
  public:

    static void log (const string& str);
    static void log (const number& num);
    static void log (Object *obj);

  };

  string toString(Object *obj) {
    return obj->toString();
  }

  string toString(const string& str) {
    return str;
  }

  string toString(number num) {
    return string(num);
  }

  string::string(number n) {
    std::stringstream ss;
    ss << n;
    const char *data = ss.str().c_str();
    length_ = strlen(data);
    data_ = data;
  }

  string string::operator+ (const string& rhs) const {
    char *data = new char[length_ + rhs.length_];
    strcpy(data, data_);
    strcpy(data + length_, rhs.data_);
    return string(data);
  }

  string operator+ (const char *lhs, const string& rhs) {
    return string(lhs) + rhs;
  }

  template<typename T> string Array<T>::toString() {
    string str = "[";
    for (auto& it : ary_) {
      str = str + JSX::toString(it);
    }
    str = str + "]";
    return str;
  }

  template<typename T> template<typename... Args> int Array<T>::push(const Args&... itemN) {
    return push_(itemN...);
  }

  template<typename T> int Array<T>::push_() {
    return length;
  }

  template<typename T> template<typename... Args> int Array<T>::push_(const Nullable<T>& t, const Args&... itemN) {
    ary_.push_back(t);
    length++;
    return push(itemN...);
  }

  template<typename T> Nullable<T> Array<T>::shift() {
    Nullable<T> first = ary_[0];
    ary_.pop_front();
    length--;
    return first;
  }

  void console::log (const string& str) {
    std::cout << str << std::endl;
  }

  void console::log (const number& num) {
    std::cout << num << std::endl;
  }

  void console::log (Object* obj) {
    std::cout << obj->toString() << std::endl;
  }

}

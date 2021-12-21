---
layout: post
title: Invoking C Code from Golang
date: 2021-12-21
type: post
parent_id: '0'
published: true
password: ''
status:
categories:
- Golang
- C
- CGO
tags:
- Golang
- C
- CGO
author: sarthakmakhija
permalink: "/invoking-C-code-from-golang/"
feature-img: "assets/img/pexels/invoking-C-code-from-golang.png"
thumbnail: "assets/img/pexels/invoking-C-code-from-golang.png"
excerpt: Let's explore Golang's C package to invoke C code from Golang by building a linked list in C which would offer put, get, getAllValues, length and close features.
---

The article attempts to explore Golang's "C" package which allows invoking C code from Golang. Before we get into the idea
of invoking C code from Golang, let's see a use-case where this might be needed.

### Interfacing with an existing C library
Let's consider that we wish to develop a storage engine for pmem (persistent memory) in Golang. In order to develop this, we might want to use
[pmdk](https://github.com/pmem/pmdk) which is written in C. This effectively means we want a way to bridge Golang and C code; invoke C code 
from Golang.

### "C" package in Golang
Go provides a package called "C" to interface with C code. Some features provided by this package includes - 
- standard C numeric types
- access to structs defined in C
- access to function like `malloc` and `free`

### C Code
Let's create a linked list in C which will be later invoked from Golang code. Let's start with `linkedlist.h` file which defines the `Node` struct, and the operations supported by linked list.

{% highlight C %}
struct Node {
    int key;
    int value;
    struct Node *next;
};

void put(int key, int value);
int get(int key);
{% endhighlight %}

Our `Node` class has a key, a value which is of type `integer` and a pointer to the next node. It supports 2 behaviors `put` and `get`.

Let's add `linkedlist.c` and add `put` to begin with.

{% highlight C %}
#include "linkedlist.h"
#include <stdlib.h>

struct Node *head = NULL;
struct Node *current = NULL;

void put(int key, int value) {
    if (head == NULL) {
        head = (struct Node*)malloc(sizeof(struct Node));
        head -> key = key;
        head -> value = value;
        current = head;
    }
    else {
        struct Node *next = (struct Node*)malloc(sizeof(struct Node));
        next -> key = key;
        next -> value = value;
        current -> next = next;
        current = next;
    }
}
{% endhighlight %}

`put` does the following -
- If head is NULL
  - create a `new node`
  - point `head` to the `new node`
  - assign key and value to the `head`
  - point `current` to the `head`
- Else
  - create a `new node`
  - assign key and value to the `new node`
  - assign `next` of the `current` node to the `new node`
  - point `current` to the `new node`  

Let's add `get` which will return a value by key.

{% highlight C %}
int get(int key) {
    struct Node* node = head;
    while (node->key != key && node != NULL) {
        node = node -> next;
    }
    if (node == NULL) {
        return -1;
    }
    return node -> value;
}
{% endhighlight %}

`get` does the following -
- Make a temporary variable `node` point to `head`
- Iterate while `node` is not NULL and `key of the node` is not equal to the incoming `key`
- If `node` is NULL, return -1
- Else return the value pointed by `node`

### Time to invoke C code from Golang

Let's create a file `linkedlist.go` which will provide `Put` and `GetByKey` behaviors. These functions will internally invoke C functions.

{% highlight golang %}
package linkedlist

// #cgo CFLAGS: -g -Wall
// #include "linkedlist.h"
import "C"
{% endhighlight %}

This is how the beginning of our go file looks like - 
- Go package is `linkedlist`
- The import "C" allows us to interface with C code
- The comments above it is the actual C code that will be consumed by the rest of our golang code 
- We include `linkedlist.h` for our linked list related functions 
- Directives for cgo - adding the line `#cgo CFLAGS: -g -Wall` compiles the C files with the gcc options -g which is used to enable debug symbols and -Wall which is used to enable all warnings

Let's add `Put`.

{% highlight golang %}
func Put(key, value int) {
	C.put(C.int(key), C.int(value))
}
{% endhighlight %}

Golang `Put` does the following -
- Creates a C int by using `C.int` on key and value
- Invokes `put` by using `C.put`

Let's add `GetBy`.

{% highlight golang %}
func GetBy(key int) int {
    return int(C.get(C.int(key)))
}
{% endhighlight %}

Golang `GetBy` does the following -
- Creates a C int by using `C.int` on key
- Invokes `get` by using `C.get`
- Convert the return value from `C.get(C.int(key))` to `Golang's int`

*Putting it all together* -

{% highlight golang %}
package linkedlist

// #cgo CFLAGS: -g -Wall
// #include "linkedlist.h"
import "C"

func Put(key, value int) {
    C.put(C.int(key), C.int(value))
}

func GetBy(key int) int {
    return int(C.get(C.int(key)))
}
{% endhighlight %}

Let's add a Golang test to see if this integration works or not.

{% highlight golang %}
package linkedlist_test

import (
	"reflect"
	"testing"
)
import "linkedlist"

func TestPutsASingleKeyValue(t *testing.T) {
    linkedlist.Put(10, 100)
    
    value := linkedlist.GetBy(10)
    if value != 100 {
        t.Fatalf("Expected %v, received %v", 100, value)
    }
}
{% endhighlight %}

Let's Run the test using `go test`, and it should work.

### Freeing the linked list

We would like to add another test which adds multiple key value pairs and gets a value by key. Before we do that, we would like to start with a fresh linked list
for each test. In order to do that let's add a behavior `close` in C linked list which frees all the nodes in the linked list.

{% highlight C %}
void close() {
  struct Node* node;
  while (head != NULL) {
      node = head;
      head = head->next;
      free(node);
  }
}
{% endhighlight %}

`close` does the following -
- Make a temporary variable `node` 
- Iterate while `head` is not NULL 
- Make `node` point to head and move head ahead
- free the memory pointed to by `node`

Let's invoke `C's close` from Golang

{% highlight golang %}
func Close() {
	C.close()
}
{% endhighlight %}

Let's edit the existing test case and add a new one.

{% highlight golang %}
func TestPutsASingleKeyValue(t *testing.T) {
    defer linkedlist.Close()
    linkedlist.Put(10, 100)

    value := linkedlist.GetBy(10)
    if value != 100 {
        t.Fatalf("Expected %v, received %v", 100, value)
    }
}

func TestPutsMultipleKeyValues(t *testing.T) {
    defer linkedlist.Close()
    linkedlist.Put(10, 100)
    linkedlist.Put(20, 200)
    linkedlist.Put(30, 300)

    value := linkedlist.GetBy(20)
    if value != 200 {
        t.Fatalf("Expected %v, received %v", 200, value)
    }
}
{% endhighlight %}

As a part of these tests, we are now closing the linked list `defer linkedlist.Close()` which will internally free all the nodes.

### Let's get all the values
We would like to return all the values from linked list. As a first step, we would like to return a pointer to an integer from C code to Golang.
Let's code `getAllValues` in C.

{% highlight C %}
int* getAllValues() {
     int len = length();
     int* values = malloc(len * sizeof(int));
     struct Node* node = head;
     int index = 0;

     while (node != NULL) {
         values[index] = node -> value;
         node = node -> next;
         index = index + 1;
     }
     return values;
}
{% endhighlight %}

`getAllValues` does the following -
- Invokes `length` to get the total number of nodes in the linked list
- Allocate memory to hold `len` integer values in a variable called `values`
- Create a pointer called `node` to point to `head`
- Iterate while `node` is not NULL
- Collect the value pointed to by `node` in `values`
- Return `values` which is a pointer to an integer

Let's also add `length` function -

{% highlight C %}
int length() {
    int count = 0;
    struct Node* node = head;
    while (node != NULL) {
        node = node -> next;
        count = count + 1;
    }
    return count;
}
{% endhighlight %}
`length` does the following -
- Create a pointer called `node` to point to `head`
- Iterate while `node` is not NULL
- Increment count for each node
- Return count

Time to invoke `getAllValues` from Golang.

{% highlight golang %}
func GetsAllValues() []int {
	length := int(C.length())
	intPointer := C.getAllValues()
	defer C.free(unsafe.Pointer(intPointer))

	slice := (*[1 << 28]C.int)(unsafe.Pointer(intPointer))[:length:length]

	var values []int
	for index := 0; index < length; index++ {
		values = append(values, int(slice[index]))
	}
	return values
}
{% endhighlight %}

`GetAllValues` does the following -
- Invokes `C.length` to get the total number of linked list nodes
- Invokes `C.getAllValues()` to get a pointer to an integer
- We would like to free the memory held by the pointer to an integer returned from `C.getAllValues()`. In order to do that, we need to invoke `C.free` and
  we use `unsafe.Pointer` which allows creating a pointer to any arbitrary type
- In order to be able to invoke `C.free` or `C.malloc` we need to import `stdlib.h` in Golang code
- So far we have a pointer or let's say a C pointer. We need a way to convert that to Go slice. 
  
The expression `slice := (*[1 << 28]C.int)(unsafe.Pointer(intPointer))[:length:length]` is made up of 3 parts -
{% highlight golang %}
    1. unsafePointer := unsafe.Pointer(intPointer) creates an unsafe pointer

    2. arrayPtr := (*[1 << 28]C.int)(unsafePointer).`*[1 << 28]C.YourType` doesn't do anything itself, it is a type. 
    Specifically, it is a pointer to an array of size 1 << 28, of C.YourType values. 
    Statement 2) converts unsafePointer to a pointer of the type *[1 << 28]C.int

    3. slice := arrayPtr[:length:length], slices the array into a Go slice
{% endhighlight %}

- We now have a Golang slice of type `C.int` but we need to return a Golang slice of `Go int`. So we iterate through the `slice`, convert `C.int` to `Golang int`,
collect `values` and return it

Let's quickly add a golang test for `GetAllValues`.

{% highlight golang %}
func TestGetAllValues(t *testing.T) {
    defer linkedlist.Close()
    linkedlist.Put(10, 100)
    linkedlist.Put(20, 200)
    linkedlist.Put(30, 300)

    values := linkedlist.GetAllValues()
    expected := []int{100, 200, 300}
    
    if !reflect.DeepEqual(expected, values) {
        t.Fatalf("Expected %v, received %v", expected, values)
    }
}
{% endhighlight %}

### Code
The code for this article is available [here](https://github.com/SarthakMakhija/CGO-learning)

### References
- [Calling C code from go](https://karthikkaranth.me/blog/calling-c-code-from-go/)
- [Golang slices and C pointers](https://stackoverflow.com/questions/64852226/how-to-iterate-through-a-c-array)
- [ld: symbol(s) not found for architecture x86_64](https://github.com/golang/go/issues/31409)
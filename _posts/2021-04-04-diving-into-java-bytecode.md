---
layout: post
title: Diving into Java Bytecode
date: 2021-04-04
type: post
parent_id: '0'
published: true
password: ''
status: published
categories:
- JVM
- Bytecode
tags:
- Java
- JVM
- Bytecode
author: sarthakmakhija
permalink: "/diving-into-java-bytecode/"
feature-img: "assets/img/pexels/diving-into-java-bytecode.png"
thumbnail: "assets/img/pexels/diving-into-java-bytecode.png"
excerpt: Java code is compiled into an intermediate representation called as "bytecode". It is this bytecode which gets executed by JVM and is later converted into machine specific instructions by JIT compiler. With this article, we attempt to dive into bytecode and understand the internals of various bytecode operations.
---

<blockquote class="wp-block-quote">
    <p>Java code is compiled into an intermediate representation called as "bytecode". It is this bytecode which gets executed by JVM and is later converted into machine specific instructions by JIT compiler. With this article, we attempt to dive into bytecode and understand the internals of various bytecode operations.</p>
</blockquote>

This article aims to cover the following content -

### Content
1. Terminology
2. Class file structure
3. Bytecode execution model
4. Introducing bytecode opcodes
5. Opcodes for object creation
6. Java compiler optimization
7. References

Let's get an understanding of some terms before we start to dive in.

### Terminology

**Bytecode**

An intermediate representation of Java code which JVM understands.

<blockquote class="wp-block-quote">
    <p>This intermediate representation is called bytecode because each "opcode" is represented by 1 byte. This effectively means, a total of 256 opcodes are possible.</p> 
</blockquote>

These opcodes may take arguments and arguments can be upto 2 bytes long. This means a bytecode instruction, combination of opcode and arguments could be as long as 3 bytes.

We will see various opcodes as we move on, but let's take a quick glimpse of an instruction which is an output from **javap** utility -
{% highlight java %}
9: iconst_0
{% endhighlight %}

- iconst_0 is an opcode which pushes a constant value 0 on top of stack
- Every bytecode instruction is prefixed by an integer which represents an instruction offset in bytecode. This comes handy when a "goto" opcode is used

**javap**

Standard Java class file disassembler distributed with JDK. It provides a human-readable format of class file. 

### Class file structure

<<Pending>>

### Bytecode execution model

JVM operates using stack as its execution model. Stack, LocalVariableTable and the constant pool of the class are used in order to execute bytecode. 

**Stack**
Most of the opcodes operate by pushing-in or popping-out value to or from the stack. Eg; **iconst_0** pushes 0 on top of the stack.

**LocalVariableTable**
In order to allow a variable to be assigned a value, a local variable table is used. ```LocalVariableTable``` is a simple data structure which contains the name of the variable, 
its data type, its slot along with other fields. 

LocalVariableTable contains -
- variables that are local to a method 
- method parameters 
- ```this```, if the method is not static. ```this``` is allocated slot 0 in LocalVariableTable

Eg; **istore_1** is an opcode which stores an integer value from top of the stack into LocalVariableTable at slot 1.

**Constant pool**
Is a part of class file which contains - 
- string values
- doubles/float values
- names of classes
- interfaces
- fields

which are used in a class. Various opcodes like **invokevirtual** refer to constant pool entry to identify the virtual method to be invoked.
{% highlight java %}
1: invokevirtual #7  // Method run:()Ljava/lang/Object;
{% endhighlight %}
Here, **invokevirtual** refers to an entry in constant pool and the entry indicates the method to be called along with its parameter and return type. 

### Introducing bytecode opcodes
Let's take a simple example which adds 2 integers to understand opcodes and their execution. 

**AdditionExample**

{% highlight java %}
public class AdditionExample {
    public int execute() {
        int addend = 10;
        int augend = 20;
        return addend + augend;
    }
}
{% endhighlight %}

**bytecode (AdditionExample)**

{% highlight java %}
public class AdditionExample {
    public AdditionExample();
        Code:
            0: aload_0
            1: invokespecial #1   // Method java/lang/Object."<init>":()V
            4: return
    
    public int execute();
        Code:
            0: bipush        10
            2: istore_1
            3: bipush        20
            5: istore_2
            6: iload_1
            7: iload_2
            8: iadd
            9: ireturn

        LocalVariableTable:
        Start  Length  Slot  Name     Signature
            0      10     0  this     Lorg/sample/AdditionExample;
            3       7     1  addend   I
            6       4     2  augend   I
}
{% endhighlight %}

We will get to the bytecode of ```AdditionExample()``` a little later, let's understand the bytecode of ```execute``` method first - 
1. **bipush** is an opcode which pushes a byte sized integer on the stack. It takes an argument which is 10 in our case
2. **istore_1** takes the value from top of the stack, which is 10 and assigns it into LocalVariableTable at slot 1. This opcode removes the value from stack top
3. **bipush** now pushes 20 to the top of the stack
4. **istore_2** takes the value from top of the stack, which is 20 and assigns it into LocalVariableTable at slot 2
5. At this stage, values 10 and 20 have been assigned to addend and augend in LocalVariableTable, and our stack is empty. This means these 2 values need to be brought into stack before an addition can be performed
6. **iload_1** copies the value from slot 1 of LocalVariableTable to the stack
7. **iload_2** copies the value from slot 2 of LocalVariableTable to the stack
8. Stack now contains 10 and 20. **iadd** pops 2 integer values from top 2 positions of stack and sums them up. It stores the result back in the stack top
9. **ireturn** takes the value from stack top and returns an integer

Following diagram represents the overall execution -
<div class="wp-block-image is-style-default">
    <img style="padding-left: 0; max-width: 125%" src="{{ site.baseurl }}/assets/img/pexels/addition-example.png" class="wp-image-878"/>
</div>
<p></p>

Few things to note-
- All the opcodes are prefixed with an ```i```, indicating that we are dealing with an integer data type 
- Slot 0 of LocalVariableTable is occupied by ```this``` of AdditionExample
- All the entries in LocalVariableTable are statically typed
- Bytecode is statically typed in a sense that all the opcodes which work with specific data type   

Quick summary of opcodes that we have seen so far -

| Opcode  | Purpose |
| ------------- | ------------- |
| istore_slot  | Takes the integer value from top of the stack and assigns it into LocalVariableTable at defined slot  |
| iload_slot  | Copies the value from defined slot of LocalVariableTable to the stack  |
| bipush  | Pushes a byte sized integer on the stack |

Let's take another example, which is a slight modification of the first one. The idea is to invoke a method from another method. 

**MethodInvocation**

{% highlight java %}
public class AdditionExample {
    public int execute() {
        return add();
    }
    private int add() {
        int addend = 10;
        int augend = 20;
        return addend + augend;
    }
}
{% endhighlight %}

**bytecode (MethodInvocation)**

{% highlight java %}
public class AdditionExample {
Constant pool:
    #7 = Methodref          #8.#9          // org/sample/AdditionExample.add:()I
    #8 = Class              #10            // org/sample/AdditionExample
    #9 = NameAndType        #11:#12        // add:()I
    #10 = Utf8              org/sample/AdditionExample
    #11 = Utf8              add
    #12 = Utf8              ()I

    public AdditionExample();
        Code:
            0: aload_0
            1: invokespecial #1    // Method java/lang/Object."<init>":()V
            4: return
        
    public int execute();
        Code:
            0: aload_0
            1: invokevirtual #7   // Method add:()I
            4: ireturn
    
    private int add();
        Code:
            0: bipush        10
            2: istore_1
            3: bipush        20
            5: istore_2
            6: iload_1
            7: iload_2
            8: iadd
            9: ireturn
}
{% endhighlight %}

Bytecode in ```add``` method should look very familiar 😁. Let's look at the bytecode for ```execute``` method -
1. **aload_0** copies the value from slot 0 of LocalVariableTable to the stack. Slot 0 of LocalVariableTable contains ```this```, which means stack top now contains ```this```
2. Now is the time to invoke the private method ```add``` of the same class. **invokevirtual** is used for invoking the virtual method and takes a parameter which is a reference to an entry in constant pool. Let's see how does this entry get used -
    - Entries in constant pool are composable, which means an entry could be created by referring to other entries
    - #7 is a method reference entry which refers to #8 and #9
    - #8 refers to an entry #10 which specifies the name of the class ```org/sample/AdditionExample```
    - #9 refers to entries #11 and #12 which specify the method name ```add``` along with its signature ```()I``` (*no parameters, integer return type*) respectively
    - #7 provides a complete signature of the ```add``` method including its class name 
3. **invokevirtual** pops the entry from stack top which is ```this```, invokes ```add``` method and stores the result in stack top  
4. **ireturn** takes the value from stack top and returns an integer

*javap by default does not return the output for private methods, use -p flag to see the output for private methods.*

One of the questions that is worth answering is "how does invokevirtual know about the number entries to be popped out?". In order to answer this, we will modify our
previous example slightly and see the behavior of **invokevirtual**.

**MethodInvocation with parameters**

{% highlight java %}
public class AdditionExample {
    public int execute() {
        return add(10, 20);
    }
    private int add(int addend, int augend) {
        return addend + augend;
    }
{% endhighlight %}

**bytecode (MethodInvocation with parameters)**

{% highlight java %}
public class AdditionExample {
    public AdditionExample();
        Code:
            ....
    
    public int execute();
        Code:
            0: aload_0
            1: bipush        10
            3: bipush        20
            5: invokevirtual #7       // Method add:(II)I
            8: ireturn
    
    private int add(int, int);
        Code:
            ...
}
{% endhighlight %}

Let's look at the bytecode for ```execute``` method again -
1. ```this``` is pushed on the stack, followed by push of values 10 and 20
2. There is a change in signature of the method which will be invoked by invokevirtual. It now takes 2 integer parameters and returns an integer denoted as ```add:(II)I```
3. **invokevirtual** now needs to pop 3 entries from the stack, 2 integers which were pushed using **bipush** opcode and a reference to ```this``` which was pushed using **aload_0**
4. Once it pops the entries, ```add``` method is invoked and, the result is stored in stack top
5. **ireturn** takes the value from stack top and returns an integer

Effectively, **invokevirtual** knows the number of entries to be popped based on the signature of the method to be invoked. As seen in previous example, in order to invoke a method
which takes 2 parameters, we need to pop 2 values from the stack along with an instance of the current class.  

Quick summary of opcodes that we have seen so far -

| Opcode  | Purpose |
| ------------- | ------------- |
| aload_slot  | Copies the address value from a defined slot of LocalVariableTable to the stack, ```a``` stands for address  |
| invokevirtual  | Invokes virtual method, pops the entries from stack based on the signature of the method to be invoked  |

### Opcodes for object creation
Let's take an example to understand the bytecode that gets generated during object creation.

{% highlight java %}
public class Book {
    public Book(String name, Date publishingDate) {
        ///
    }
    public Date publishingDate() {
        return new Date();
    }
}
{% endhighlight %}
This example uses ```java.util.Date```, (don't ask why) and returns a ```new Date``` as a part of ```publishingDate``` method (again, don't ask why 😁).

**bytecode (Object creation)**

{% highlight java %}
public class Book {
public java.util.Date publishingDate();
    Code:
        0: new           #7     // class java/util/Date
        3: dup
        4: invokespecial #9     // Method java/util/Date."<init>":()V
        7: areturn
}
{% endhighlight %}

This is a new territory that we are going into. Let's understand the bytecode -
1. **new** allocates the required memory for the object but does not call the constructor. It refers to the constant pool and identifies the object which is ```java/util/Date``` here, and allocates the required memory
2. Our stack now contains the object reference created by **new**  
3. Before we understand **dup**, let' understand the need for it -
    - Let's assume there is no **dup**
    - Our stack contains the object reference which means it is referring to some memory allocated by **new** opcode
    - So far our ```date``` object has not been initialized. We need another opcode (invokespecial) for initializing it 
    - **invokespecial** is used for invoking special methods like constructors. **invokespecial** refers to an entry in the constant pool (#9), resolves it
      to the init method of ```java.util.Date``` class. 
    - **invokespecial** will pop the entry from stack top, invoke the ```init``` method of ```java.util.Date```. This means our date object is fully initialized now 
    - But, now our stack does not contain any reference to the newly created object because it was popped by **invokespecial** to invoke a method which does not return anything
4. So, we need **dup** to duplicate the entry on stack top
5. **invokespecial** pops the entry from stack top, invokes the ```init``` method of ```java.util.Date``` class to initialize the object
6. We now have the stack containing an object reference which refers to the fully created ```java.util.Date``` instance
7. **areturn** takes the value from stack top and returns ```java.util.Date``` address

Following diagram represents the overall execution -
<div class="wp-block-image is-style-default">
    <img style="padding-left: 0; max-width: 70%" src="{{ site.baseurl }}/assets/img/pexels/new-dup.png" class="wp-image-878"/>
</div>
<p></p>

Quick summary of opcodes that we have seen so far -

| Opcode  | Purpose |
| ------------- | ------------- |
| new  | Allocates the required memory for the object does not call the object constructor |
| dup  | Duplicates the entry on stack top |
| invokespecial  | Invokes special methods like constructors  |

### References

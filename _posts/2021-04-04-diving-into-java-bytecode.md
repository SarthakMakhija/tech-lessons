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

### Content
1. Terminology
2. Class file structure
3. Bytecode execution model
4. Understanding bytecode opcodes
5. Examples
6. References

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
- ```this```, if the method is not static. ```this``` is given slot 0 in LocalVariableTable

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

### Understanding bytecode opcodes
Let's take some simple examples to understand opcodes and their execution. 

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

**bytecode-AdditionExample**

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

Let's understand the bytecode of ```execute``` method first - 
1. **bipush** is an opcode which pushes a byte sized integer on the stack. It takes an argument which is 10 in our case
2. **istore_1** takes the value from top of the stack, which is 10 and assigns it into LocalVariableTable at slot 1. This opcode removes the value from stack top
3. **bipush** now pushes 20 to the top of the stack
4. **istore_2** takes the value from top of the stack, which is 20 and assigns it into LocalVariableTable at slot 2
5. At this stage, values 10 and 20 have been assigned to addend and augend in LocalVariableTable, and our stack is empty. This means these 2 values need to be brought into stack before an addition can be performed
6. **iload_1** copies the value from slot 1 of LocalVariableTable to the stack
7. **iload_2** copies the value from slot 2 of LocalVariableTable to the stack
8. Stack now contains 10 and 20. **iadd** pops the 2 integer values from top 2 positions of stack and sums them up. It stores the result back in the stack top
9. **ireturn** takes the value from stack top and returns an integer

Few things to note-
- All the opcodes are prefixed with an ```i```, indicating that we are dealing with an integer data type 
- Slot 0 of LocalVariableTable is occupied by ```this``` of AdditionExample
- All the entries in LocalVariableTable are statically typed
- Bytecode is statically typed in a sense that all the opcodes which work with specific data type   

<<Picture Pending>>

### Examples

### References

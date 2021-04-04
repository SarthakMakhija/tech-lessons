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
2. Structure of class file
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

### Structure of class file

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

### Examples

### References

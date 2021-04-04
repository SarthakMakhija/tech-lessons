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
feature-img: "assets/img/pexels/aws-lambda-virtual-podcast.png"
thumbnail: "assets/img/pexels/aws-lambda-virtual-podcast.png"
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



### Understanding bytecode opcodes

### Examples

### References

---
title: About Me
layout: page
permalink: /about/
icon: "fa-male"
hide_title: true
---
<div class="self-container">
    <p><img class="self-image" alt="Sarthak Makhija" src="/assets/img/pexels/self.png"></p> 
    <p class="self">Sarthak Makhija</p>
</div>
<hr/>
I am an application developer at ThoughtWorks. I had worked with Citigroup and TCS before I joined ThoughtWorks. 

My current interest is around *Designing storage engines and databases*. 

## My Projects

I love working on my personal projects in free time. Some of my projects include –

🔹 [goselect](https://github.com/SarthakMakhija/goselect)

goselect provides SQL like 'select' interface for files. This means one can execute a select query like:

`select name, path, size from . where or(like(name, result.*), eq(isdir, true)) order by 3 desc`
to get the file name, file path and size of all the files that are either directories or their names begin with result. The result will be ordered by size in descending order.

The project goselect was created to understand the following:
- **Parsing**: The parsing pipeline typically involves a lexer, a parser and an AST.
- **Recursive descent parser**
- **Representation of functions in the code**. Functions like `lower`, `upper` and `trim` take a single parameter, functions like `now` and `currentDate` take zero parameters whereas functions like `concat` take a variable number of parameters.
- **Execution of scalar functions like `lower`, `upper` and `substr`**. These functions are stateless and run for each row. They may take a parameter and return a value for each row. These functions can also involve nesting. For example, `lower(substr(ext, 1))`.
- **Execution of aggregation functions like `average`, `min`, `max` and `countDistinct`**. These functions run over a collection of rows and return a final value. These functions can also involve nesting. For example, `average(count())`.
- **Execution of nested scalar and aggregation functions like `countDistinct(lower(name))`**. Here, the function `lower(name)` runs for each row whereas `countDistinct` runs over a collection of rows.

🔹 [Gamifying Refactoring](http://gamifying-refactoring.github.io/)

Refactoring is fun to learn and practice. It is even more fun if you get to learn it together by playing a game.

All you got to do is - identify code smells, justify each of them by going beyond ilities, finish all of this in a fixed time and get points for your team. Learn and have fun. This is the idea behind "Gamifying Refactoring".

🔹 [Data-anon](https://github.com/dataanon/data-anon)

Data Anonymization tool helps build anonymized production data dumps, which can be used for performance testing, security testing, debugging and development. This tool is implemented in Kotlin, and works with Java 8 & Kotlin.

🔹 [Flips](https://github.com/Feature-Flip/flips)

Flips is an implementation of [Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) pattern for Java. Feature Toggles are a powerful technique, allowing teams to modify system behavior without changing the code.

The idea behind Flips is to let the users implement toggles with minimum configuration and coding. This library is intended to work with Java8, Spring Core / Spring MVC / Spring Boot.

I have a separate [blog](https://tech-lessons.in/flips-feature-flipping-for-java/) about this library.

## Next project

I hope to build a key/value storage engine in Rust. The idea is to build a write-optimized storage engine using LSM tree and provide read-optimized paths. 
Some ideas that I would like to explore are:
1. Separating values from keys: [WiscKey](https://www.usenix.org/system/files/conference/fast16/fast16-papers-lu.pdf)
2. Explore [io_uring](https://unixism.net/loti/what_is_io_uring.html) and [glommio](https://github.com/DataDog/glommio)
3. Cache bloom filters in memory
4. Cache level-0 SSTables in memory 

## What I love doing

I love reading technical books and sharing my learnings with the community.

## Get In Touch
<a href="https://www.linkedin.com/in/sarthak-makhija-7a165a55/"><img style="padding-left: 0" alt="Happy to connect" src="/assets/img/pexels/linkedin.png"></a>

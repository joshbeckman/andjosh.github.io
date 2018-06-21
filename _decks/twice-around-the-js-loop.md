---
layout: reveal
title: Twice Around The JS Event Loop
permalink: /presents/twice-around-the-javascript-event-loop/
presented_at: Chicago JavaScript Meetup
date: 2018-05-26
---

<section data-markdown>

# {{ page.title }}

</section>
<section data-markdown>
## Often Heard

- JavaScript is single-threaded
- JavaScript is event-driven
- JavaScript is asynchronous
- JavaScript is the same in Node.js & the browser
</section>
<section data-markdown>
## What Happens?

```js
var a = setTimeout(function foo() {
    Promise.resolve('foo')
        .then(console.log);
}, 0);
var b = setTimeout(function bar() {
    console.log('bar');
}, 0);
```
</section>
<section data-markdown>
## Browsers

Stack-governed

Task-driven
- Macrotasks
- Microtasks
</section>
<section data-markdown>
## Macrotasks

- Events
- Timeout/Interval
- HTTP
- RequestAnimationFrame
</section>
<section data-markdown>
## Microtasks

- Promises
- Object Observers
</section>
<section data-markdown>
## Browser Event Loop

1. Run the oldest task in macrotask queue.
2. Run _all_ available tasks in microtask queue.
3. Rinse, repeat (loop)
</section>
<section data-markdown>
## Browser Event Loop

- Macrotasks created in-loop are processed next loop
- Microtasks created in-loop are processed until queue is empty
</section>
<section data-markdown>

## We're Hiring @ OfficeLuv!

https://officeluv.github.io

</section>
<section data-markdown>

## Thanks!

https://www.andjosh.com/presents

</section>

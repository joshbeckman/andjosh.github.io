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

## What Happens?

```js
var a = setTimeout(() => {
    Promise.resolve('foo')
        .then(console.log);
}, 0);
var b = setTimeout(() => {
    console.log('bar');
}, 0);
```

</section>
<section data-markdown>

## We're Hiring @ OfficeLuv!

https://officeluv.github.io

</section>
<section data-markdown>

## Thanks!

https://www.andjosh.com/presents

</section>

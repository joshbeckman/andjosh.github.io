---
layout: post
title: Middleware code test goes here
---

This guide covers Koa topics are not directly API related, such as best practices for writing middleware,
  application structure suggestions.

## Writing Middleware

  Koa middleware are simple functions which return a `GeneratorFunction`, and accept another. When
  the middleware is run by an "upstream" middleware, it must manually `yield` to the "downstream" middleware.

For example if you wanted to track how long it takes for a request to propagate through Koa by adding an `X-Response-Time` header field the middleware would look like the following.

```javascript
# test code
function test(){
    console.log('hello');
}
```

para graph

```javascript
function *responseTime(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
}

app.use(responseTime);
```

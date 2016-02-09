---
layout: post
title: Exponential Back-Off in JavaScript
---

I recently was banging too frequently on a client's API, so had to write an exponential back-off method. I wanted it to work in both environments we were running. One was a Node.js generator-based server; the other was client-side, using callback architecture.

~~~javascript
/**
 * backOff
 *
 * @param {Number} iter
 * @param {Number} floor
 * @param {Number} base
 * @return {Function}
 */
function backOff(iter, floor, base) {
    iter = iter || 0;
    floor = floor || 500;
    base = base || 2;
    return function(done) {
        setTimeout(done, floor * Math.pow(base, iter));
    };
}
~~~

With this method, you can call it either as a `yieldable` generator or pass a callback.

~~~js
// ES6 generator
callsAlreadyMade++;
if (status !== 200) {
    yield backOff(callsAlreadyMade);
    myRetryMethod(arg, argTwo);
} else {
    myNextMethod(arg, argTwo);
}
~~~

~~~javascript
// callback architecture
callsAlreadyMade++;
if (status !== 200) {
    backOff(callsAlreadyMade)(myRetryMethod.bind(this, arg, argTwo));
} else {
    myNextMethod(arg, argTwo);
}
~~~


---
layout: post
title: Error Tracking in gatrack.js
tags:
- Google Analytics
- Javascript
---

I'm releasing a new [gatrack.js](https://github.com/jbckmn/gatrack.js/releases) this week (previously [introduced back in January](http://words.andjosh.com/post/track-all-the-things-in-google-analytics)). Amongst some minor fallback improvements, the main changes are:

- The library is now [compressed to well below 3kb](https://github.com/jbckmn/gatrack.js#way-cool) (with the help of more efficient function calls).
- Gatrack.js now has the ability to [track client-side/script errors as events](https://github.com/jbckmn/gatrack.js#tracking-errors) in Google Analytics.
- I've created an [official project page](http://jbckmn.github.io/gatrack.js/).

The ability to track client-side errors in an efficient and referential way is invaluable. I've seen a few options out there, but none that allow me both to have absolutely no worry about keeping it running and to have error data tied into the visitor's browsing history elsewhere on my sites.

By putting the error details into a Google Analytics event, you can immediately tie it to the rest of the user's session history. Gatrack.js also goes a step further than providing you with just the  available error details - it includes [the time at which the error was triggered](https://github.com/jbckmn/gatrack.js#tracking-errors) (relative to page load).

Enabling error tracking in Google Analytics with gatrack.js is a one-liner. All you need to do is place the following snippet in a `script` tag so that it will be the first code executed on your page, preferrably in the `head` of your document.

```javascript
// One-liner, minified (use this one!)
(function(g,a,t,r,a,c,k){g[r]=g[r]||{};g[r][a]=t.getTime();g[r][c]=[];g[c]=function(m,u,l,c,e){this.gatrack.onerror.push([m,u,l,c,e])}})(window,document,(new Date()),'gatrack','timer','onerror');
```

Here is the snippet, expanded for clarity:

```javascript
// Expanded, so you can see
(function(g,a,t,r,a,c,k){
  g[r] = g[r] || {};
  g[r][a] = t.getTime();
  g[r][c] = [];
  g[c] = function( m, u, l, c, e ) {
    this.gatrack.onerror.push([m, u, l, c, e]);
  };
})(window,document,(new Date()),'gatrack','timer','onerror');
```

This snippet will allow you to record errors that are raised even before any other JavaScript code is executed. The gatrack.js library records errors in the following format:

- __category__: 'Recorded Error'
- __label__: The error's message string
- __action__: 'Error line:column(url)'
- __value__: Time of occurence after HTML load (in seconds, rounded to nearest hundreth)

I know this error tracking method has allowed me to chase down a couple IE bugs, so I hope it will help others increase usability for their users. It also translates into a really direct Key Performance Indicator for businesses to tap into. Hint: I'm already doing that as well.

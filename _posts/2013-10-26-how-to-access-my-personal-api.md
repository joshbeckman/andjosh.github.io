---
layout: post
title: How To Access My Personal API
---

I though it would be useful to have access to basic information about a person in a standardized format, query-able and programmable without having to muck around with a third-party social-media application.

> An API into your person could be quick and useful.

Nothing sensitive need be contained, just something that could list out your
social accounts (all of them), tell me where you're currently located, what you
can do, etc. It would be cool to expose some dynamic data like calculated real-time age, latest blog/social media post, or other public data.

> So, I made one.

You can access my personal API at [api.andjosh.com](http://api.andjosh.com).
It's got everything listed above, plus a little extra about my usual languages
and frameworks. It supports JSONP with an optional `callback` parameter.

No keys required, possible uses for an API like this (especially if others
implement something similar) include:

- Dynamically calculated ages for operatros of a "personal API"
- Statistics on laguange or framework usage
- Graphing opening locations
- Dynamically display latest blog posts, by person
- Operating a repository of users' associated social accounts
- ?

_P.S._ If you do run something similar, let me know what you think about standardizing a format for personal APIs like this.

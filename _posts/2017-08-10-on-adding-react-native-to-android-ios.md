---
title: On Adding React Native to Existing iOS and Android Apps
date: 2017-08-10 00:00:00 Z
layout: post
---

> I write in defense of the beliefs I fear are least defensible. Everything else feels like homework.
> <br/>- Sarah Manguso, _300 Arguments_

No homework for me today. I woke up and integrated new [React Native][0] code into an existing [Swift 3][1] iOS app.

I spent 5 hours getting the bare dependencies to compile React components into the existing app codebase, then 3 hours building an interface in React that would have taken a day in native iOS. I was also able to copy and paste our existing JavaScript business logic libraries with zero problem. It felt as if I spent all morning painfully biking up a mountain, after which I'm [now coasting downhill][3].

Tomorrow is biking up the mountain to integrate React Native into our Android app. Luckily I have [Nevzat][2] to help with that.

I will write up all of this once a full release cycle is complete.

__Update:__ This made its way into [a full talk on bridging native apps with React Native][4].

[0]: https://facebook.github.io/react-native/
[1]: https://swift.org
[2]: https://gitlab.com/nevzat
[3]: https://www.youtube.com/watch?v=fYGPcfUqzL0
[4]: http://www.andjosh.com/presents/bridge-existing-ios-android-apps-react-native/

---
layout: post
title: Fix to Enable Display Features - Google Analytics iOS SDK
---

In the official Google Analytics iOS SDK documentation, this function call will enable Display Features in your app:

~~~objc
id tracker = [[GAI sharedInstance] defaultTracker]; // Enable Advertising Features. 
[tracker set:allowIDFACollection value:@YES]; 
~~~ 

Sadly, this causes an error, as `allowIDFACollection` is an invalid key. The real way to enable display features is to call this method:
 
~~~objc
[[GAI sharedInstance].defaultTracker setAllowIDFACollection:YES]; 
~~~ 

Save yourself a few minutes of frustration. Build and be happy.

---
layout: chart
title: United States Drone Strikes
permalink: /charts/us-drone-strikes/
---

<style>
.zoom {
    fill: transparent;
    cursor: pointer;
}
.y-axis path,
.y-axis line,
.x-axis path,
.x-axis line {
    stroke: black;
    fill: none;
    stroke-width: 1px;
}

.y-axis g line {
    stroke: grey;
    fill: none;
    stroke-width: 1px;
}
.graph-body .line circle {
    opacity: 0.1;
}
.delimiter {
    display: none;
}
</style>
<script src="/js/vendor/eventDrops.js"></script>
<script src="/js/charts/drones.js"></script>
<script src="http://api.dronestre.am/data?callback=drones.load"></script>

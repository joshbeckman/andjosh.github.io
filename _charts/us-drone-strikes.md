---
title: United States Drone Strikes
permalink: "/charts/us-drone-strikes/"
layout: chart
---

<style>
.zoom {
    fill: transparent;
    cursor: pointer;
}
svg text {
    font-family: sans-serif;
    font-size: 12px;
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
<div id="loading">Calling all drones...</div>
### Strike Effects

<div id="chartDeathsType"></div>

### Strike Locations

<div id="chartCountry"></div>

### Strike Targets

<div id="chartTargets"></div>

// TODO: Bubble chart of deaths-per-strike by date, with trend line

// TODO: either event drops or pie chart showing whether target was hit (accuracy)

// TODO: Area chart of death types over time

// TODO: pie chart of total civilian casualties to target casualties

// TODO: Map the distance of each strike from Washington D.C.

// we don't have the hour of attacks! Otherwise a night/day graph would be of interest.



<script src="/js/vendor/eventDrops.js"></script>
<script src="/js/charts/drones.js"></script>
<script src="http://api.dronestre.am/data?callback=drones.load"></script>

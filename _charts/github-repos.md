---
layout: chart
title: GitHub Repo Contributions
permalink: /charts/github-repos/
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
<form>
    <input type="text" name="user" placeholder="GitHub username"/>
    <button type="submit">Submit</button>
</form>
<script src="http://dimplejs.org/dist/dimple.v2.1.6.min.js"></script>
<script src="/js/vendor/eventDrops.js"></script>
<script src="/js/charts/repos.js"></script>

---
layout: page
title: Graphs
permalink: /graphs/
---
<style>
    html {
        background-image: url(/images/dot.gif);
    }
    .markdown-body {
        background: transparent;
    }
    .markdown-body .site-title {
        display: none;
    }
</style>

<div id="chartContainer">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js" charset="utf-8"></script>
    <script src="http://dimplejs.org/dist/dimple.v2.1.6.min.js"></script>
    <script type="text/javascript">
        var svg = dimple.newSvg("#chartContainer", 590, 400);
        d3.csv("/data/livedPeople.csv", function (data) {
            //data = dimple.filterData(data, "Place", ["Work", "Home"])
            var myChart = new dimple.chart(svg, data);
            myChart.setBounds(60, 30, 505, 305);
            var x = myChart.addCategoryAxis("x", "Month");
            x.addOrderRule("Date");
            myChart.addMeasureAxis("y", "People");
            var s = myChart.addSeries("Place", dimple.plot.line);
            s.interpolation = "step";
            myChart.addLegend(60, 10, 500, 20, "right");
            myChart.draw();
        });
    </script>
</div>

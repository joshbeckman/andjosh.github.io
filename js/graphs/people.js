var width = document.body.clientWidth - 60,
    height = Math.min(width - 200, window.innerHeight),
    svg = dimple.newSvg('#chartContainer', width, height);

d3.csv('/csv/livedPeople.csv', function(data) {
    var myChart = new dimple.chart(svg, data),
        x,
        s;

    myChart.setBounds(60, 30, width - 100, height - 100);
    x = myChart.addCategoryAxis('x', 'Year');
    x.addOrderRule('Date');
    myChart.addMeasureAxis('y', 'People');
    s = myChart.addSeries(
        'Place',
        dimple.plot.line
    );
    s.interpolation = 'step';
    var myLegend = myChart.addLegend(
        60,
        10,
        width - 100,
        20,
        'right'
    );
    myChart.draw();

    myChart.legends = [];
    svg.selectAll("title_text")
        .data(["Click legend to","show/hide places:"])
        .enter()
        .append("text")
        .attr("x", 100)
        .attr("y", function (d, i) { return 10 + i * 10; })
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("color", "Black")
        .text(function (d) { return d; });
            var filterValues = dimple.getUniqueValues(data, "Place");
            myLegend.shapes.selectAll("rect")
                .on("click", function (e) {
                    var hide = false;
                    var newFilters = [];
                    filterValues.forEach(function (f) {
                    if (f === e.aggField.slice(-1)[0]) {
                        hide = true;
                    } else {
                        newFilters.push(f);
                    }
                });
            if (hide) {
                d3.select(this).style("opacity", 0.2);
            } else {
                newFilters.push(e.aggField.slice(-1)[0]);
                d3.select(this).style("opacity", 0.8);
            }
            filterValues = newFilters;
            myChart.data = dimple.filterData(data, "Place", filterValues);
            myChart.draw(800);
        });
});

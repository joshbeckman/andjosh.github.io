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
    myChart.addLegend(
        60,
        10,
        width - 100,
        20,
        'right'
    );
    myChart.draw();
});

var width = document.body.clientWidth - 60,
    height = Math.min(width - 200, window.innerHeight) - 200,
    svg = dimple.newSvg('#chartContainer', width, height),
    url = 'https://gist.githubusercontent.com/andjosh/796a5b7ea4aa6d9638fa/raw/099417a13de3afa2cb40cad9f863388d6ad39941/narroCost.csv';

d3.csv(url, function(data) {
    var myChart = new dimple.chart(svg, data),
        x,
        s;

    myChart.setBounds(60, 30, width - 100, height - 100);
    x = myChart.addTimeAxis('x', 'Date', '%Y-%m', '%Y/%m');
    x.addOrderRule('Date');
    myChart.addMeasureAxis('y', 'Amount');
    s = myChart.addSeries('Type', dimple.plot.line);
    //s.interpolation = 'step';
    var myLegend = myChart.addLegend(
        60,
        10,
        width - 100,
        20,
        'right'
    );
    myChart.draw();
});

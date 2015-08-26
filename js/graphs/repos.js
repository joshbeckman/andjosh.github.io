
window.repos = {
    count:      0,
    repos:      [],
    activity:   [],
    dailyActiviy: [],
    start:      new Date()
};

repos.callUser = function(name) {
    var s = document.createElement('script');

    document.getElementById('chartContainer').innerHTML = '';
    s.src = 'https://api.github.com/users/' + name +
        '/repos?type=owner&sort=pushed&callback=repos.catchUser' +
        '&access_token=a4b7b0d2e413d968ed23a793d28846130855e1ea';
    document.body.appendChild(s);
};

repos.callUser('andjosh');

repos.catchUser = function(data) {
    var s,
        meta = data.meta;

    data = data.data;
    repos.repos = data;
    repos.count = data.length;
    repos.checkLimit(data, meta);
    for (var i = 0; i < data.length; i++) {
        s = data[i].url + '/stats/commit_activity' +
            '?access_token=a4b7b0d2e413d968ed23a793d28846130855e1ea';
        asyncRequest(s, i, repos.pushActivity);
    }
};

repos.checkLimit = function(data, meta) {
    if (!data.push) {
        document.getElementById('chartContainer').innerHTML = (
            'Rate limit from GitHub hit.\nReset in ' +
            Math.round(((new Date(meta['X-RateLimit-Reset'] * 1000)) -
            (new Date()).getTime()) / 1000) + 's. Try refreshing the page.'
        );
    }
};

repos.pushActivity = function(id, data) {
    var meta = data.meta,
        date = new Date(),
        name = repos.repos[id].name,
        daily = {
                name:   name,
                dates:  []
            },
        i = 0,
        j = 0;

    data = data.data;
    repos.checkLimit(data, meta);
    for (i = 0; i < data.length; i++) {
        date = new Date(data[i].week * 1000);
        repos.activity.push({
            Repository: name,
            Commits:    data[i].total,
            Week:       date
        });
        for (j = 0; j < data[i].days.length; j++) {
            if (data[i].days[j]) {
                daily.dates.push(date);
                repos.start = new Date(
                    Math.min(repos.start.getTime(), date.getTime())
                );
            }

            date = new Date(date.getTime() + (1000 * 60 * 60 * 24 * 7));
        }
    }

    repos.dailyActiviy.push(daily);
    repos.count--;
    if (!repos.count)
        repos.makeGraph();
};

repos.makeGraph = function() {
    var width = document.body.clientWidth - 60,
        height = Math.min(width - 200, window.innerHeight),
        svg = dimple.newSvg('#chartContainer', width, height),
        myChart = new dimple.chart(svg, repos.activity),
        data = repos.activity,
        myLegend,
        x,
        s,
        eventDropsChart = d3.chart.eventDrops()
            .hasBottomAxis(false)
            .hasDelimiter(false)
            .eventLineColor('red')
            .width(width)
            .start(repos.start);

    d3.select('#chartContainer1')
        .datum(repos.dailyActiviy)
        .call(eventDropsChart);

    myChart.setBounds(60, 30, width - 100, height - 100);
    x = myChart.addCategoryAxis('x', 'Week');
    x.addOrderRule('Week');
    x.timeField = 'Week';
    x.tickFormat = '%x';
    myChart.addMeasureAxis('y', 'Commits');
    s = myChart.addSeries(
        'Repository',
        dimple.plot.bubble
    );

    myLegend = myChart.addLegend(
        60,
        10,
        width - 100,
        20,
        'right'
    );
    myChart.draw();

    myChart.legends = [];
    svg.selectAll("title_text")
        .data(["Click legend to","show/hide repos:"])
        .enter()
        .append("text")
        .attr("x", 10)
        .attr("y", function (d, i) { return 10 + i * 14; })
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("color", "Black")
        .text(function (d) { return d; });
            var filterValues = dimple.getUniqueValues(data, "Repository");
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
            myChart.data = dimple.filterData(data, "Repository", filterValues);
            myChart.draw(800);
        });
};

function doJSONP(url, callbackFuncName, cbName) {
    var fullUrl = url + "&" + (cbName || "callback") + "=" + callbackFuncName,
        script = document.createElement('script');

    script.src = fullUrl;
    document.body.appendChild(script);
}

function asyncRequest(url, id, fn) {
    window._callbacks = window._callbacks || {cntr: 0};
    var name = "fn" + window._callbacks.cntr++;

    window._callbacks[name] = function() {
        var args = [id, arguments[0]];

        delete window._callbacks[name];
        fn.apply(this, args);
    };

    doJSONP(url, "_callbacks." + name);
}
function color() {
    var ti = (new Date()).getTime(),
        i = parseInt(ti.toString()[ti.toString().length - 5], 10),
        r = Math.floor(Math.sin(i) * 127 + 128),
        g = Math.floor(Math.sin(i + 2) * 127 + 128),
        b = Math.floor(Math.sin(i + 3) * 127 + 128);

    return 'rgb(' + r + ', ' + g + ',' + b + ')';
}

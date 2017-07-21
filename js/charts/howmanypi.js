var width      = document.body.clientWidth - 60,
    height     = Math.min(width - 200, window.innerHeight) - 200,
    loading    = document.getElementById('loading'),
    svg        = dimple.newSvg('#chartContainer', width, height),
    queryDate  = window.location.href.split('today=')[1],
    today      = new Date(queryDate || (new Date())),
    todayStart = new Date(today.toJSON().substring(0, 10)),
    month      = today.getMonth(),
    year       = today.getFullYear(),
    DAYLENGTH  = 1000 * 60 * 60 * 24,
    past       = new Date(today.getTime() - (DAYLENGTH * 30)),
    future     = new Date(today.getTime() + (DAYLENGTH * 30));

(function fetchData() {
    var url = 'https://howmanypi.herokuapp.com';

    loading.innerHTML = 'Fetching data...';
    request(url, function(err, body) {
        body = JSON.parse(body);
        draw(transformData(body));
    });
})();

function transformData(data) {
    loading.innerHTML = 'Crunching numbers...';
    return [
        data.map(function(d, i, arr) {
            if (!i) return null;        // exempt first data point
            if (!d.devices[0]) return { category: 'Dwelling Within 50 RSSI', quantity: 0, date: d.created_at };
            return {
                category: 'Dwelling Within 50 RSSI',
                quantity: d.devices.filter(function(dd) {
                    if (!arr[i - 1].devices[0]) return false;
                    return dd.rssi > -50
                        && arr[i - 1].devices.filter(function(ddd) {
                            return ddd.rssi > -50 && ddd.mac === dd.mac;
                        }).length;
                }).length,
                date: d.created_at
            };
        }, []).slice(1),
        data.map(function(d) {
            if (!d.devices[0]) return { category: 'Within 75 RSSI', quantity: 0, date: d.created_at };
            return {
                category: 'Within 75 RSSI',
                quantity: d.devices.filter(function(dd) {
                    return dd.rssi > -75;
                }).length,
                date: d.created_at
            };
        }),
        data.map(function(d) {
            if (!d.devices[0]) return { category: 'Within 50 RSSI', quantity: 0, date: d.created_at };
            return {
                category: 'Within 50 RSSI',
                quantity: d.devices.filter(function(dd) {
                    return dd.rssi > -50;
                }).length,
                date: d.created_at
            };
        }),
        data.map(function(d) {
            if (!d.devices[0]) return { category: 'Total', quantity: 0, date: d.created_at };
            return {
                category: 'Total',
                quantity: d.devices.length,
                date: d.created_at
            };
        })
    ].reduce(function(a, b) {
        return a.concat(b);
    }, []);
}

function draw(data) {
    var myChart = new dimple.chart(svg, data),
        myLegend,
        filterValues,
        x, y,
        s;

    loading.innerHTML = '';
    myChart.setBounds(60, 30, width - 100, height - 100);
x = myChart.addTimeAxis('x', 'date', null, '%H:%M %m/%d');
    x.addOrderRule('Date');
    x.ticks = 10;
    y = myChart.addMeasureAxis('y', 'quantity');
    s = myChart.addSeries('category', dimple.plot.line);
    //s.interpolation = 'cardinal';
    //s.lineMarkers = true;
    myLegend = myChart.addLegend(60, 10, width - 100, 20, 'right');
    myChart.draw();
    myChart.legends = [];
    svg.selectAll("title_text")
        .data(["Click legend to","show/hide category:"])
        .enter()
        .append("text")
        .attr("x", 100)
        .attr("y", function (d, i) { return 10 + i * 10; })
        .style('font-family', 'sans-serif')
        .style('font-size', '10px')
        .style('color', 'black')
        .text(function (d) { return d; });
    // mark today's dateline
// svg.append("line")
//       .attr("x1", x._scale(todayStart))
//       .attr("x2", x._scale(todayStart))
//       .attr("y1", y._scale.range()[0])
//       .attr("y2", y._scale.range()[1])
//       .style('stroke', '#d3d3d3');
//   svg.append("text")
//       .attr("x", x._scale(todayStart) + 1)
//       .attr("y", y._scale.range()[1] - 2)
//       .text(queryDate ? queryDate : 'Today')
//       .style('font-size', '10px')
//       .style('font-family', 'sans-serif');

    filterValues = dimple.getUniqueValues(data, 'category');
    myLegend.shapes.selectAll('rect')
        .on('click', function(e) {
            var hide = false,
                newFilters = [];

            filterValues.forEach(function(f) {
                if (f === e.aggField.slice(-1)[0]) {
                    hide = true;
                } else {
                    newFilters.push(f);
                }
            });
            if (hide) {
                d3.select(this).style('opacity', 0.2);
            } else {
                newFilters.push(e.aggField.slice(-1)[0]);
                d3.select(this).style('opacity', 0.8);
            }

            filterValues = newFilters;
            myChart.data = dimple.filterData(data, 'category', filterValues);
            myChart.draw(800);
        });
}

function request(url, cb, method, post, contenttype) {
    var requestTimeout, xhr;
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (error) {
            if (console) console.log("_.request: XMLHttpRequest not supported");
            return null;
        }
    }
    requestTimeout = setTimeout(function() {
        xhr.abort();
        cb(new Error("_.request: aborted by timeout"), "", xhr);
    }, 10000);
    xhr.onreadystatechange = function(){
        if (xhr.readyState != 4) return;
        clearTimeout(requestTimeout);
        cb(xhr.status != 200 ?
            new Error("_.request: server respnse status is " + xhr.status) :
            false, xhr.responseText, xhr);
    };
    xhr.open(method ? method.toUpperCase() : "GET", url, true);
    if (!post) {
        xhr.send();
    } else {
        xhr.setRequestHeader(
            'Content-type',
            contenttype ? contenttype : 'application/x-www-form-urlencoded');
        xhr.send(post);
    }
}

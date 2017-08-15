var width      = document.body.clientWidth - 60,
    height     = Math.min(width - 200, window.innerHeight) - 200,
    loading    = document.getElementById('loading'),
    svg        = dimple.newSvg('#chartContainer', width, height),
    queryDate  = window.location.href.split('today=')[1],
    today      = new Date(queryDate || (new Date())),
    todayStart = new Date(today.toJSON().substring(0, 10)),
    todayString = today.toJSON().substring(0, 10),
    month      = today.getMonth(),
    year       = today.getFullYear(),
    DAYLENGTH  = 1000 * 60 * 60 * 24,
    BASE_API   = 'https://howmanypi.herokuapp.com',
    past       = new Date(today.getTime() - (DAYLENGTH * 30)),
    future     = new Date(today.getTime() + (DAYLENGTH * 30));

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    var millisecsInDay = 86400000;
    return Math.ceil((((this - onejan) /millisecsInDay) + onejan.getDay()+1)/7);
};

Date.prototype.toTodayTimish = function() {
    var pad = '00';
    var h = this.getUTCHours();
    var m = this.getUTCMinutes();
    var s = this.getUTCSeconds();
    return todayString + 'T'
        + (pad + h).slice(-2) + ':'
        + (pad + m).slice(-2) + ':'
        + (pad + s).slice(-2) + '.000Z';
};

(function fetchData(url, data) {
    loading.innerHTML = 'Fetching data...';
    request(url, function(err, body) {
        body = JSON.parse(body);
        data = data.concat(body.data);
        if (body.meta.next)
            return fetchData(BASE_API + body.meta.next, data);
        draw(transformData(data));
    });
})(BASE_API + '?limit=500&start=' + (new Date(0)).toJSON(), []);

function transformData(data) {
    loading.innerHTML = 'Crunching numbers...';
    return data
    .map(function(d, i, arr) {
        var date = (new Date(d.created_at));
        if (!i) return null;        // exempt first data point
        if (!d.devices[0]) return {
            category: 'Dwelling Within 50 RSSI',
            quantity: 0,
            date: date.toTodayTimish()
        };
        return {
            category: date.getDay() + ' Day of Week',
            quantity: d.devices.filter(function(dd) {
                if (!arr[i - 1].devices[0]) return false;
                return dd.rssi > -50
                    && arr[i - 1].devices.filter(function(ddd) {
                        return ddd.rssi > -50 && ddd.mac === dd.mac;
                    }).length;
            }).length,
            date: date.toTodayTimish()
        };
    })
    .slice(1);
    //data
    //.reduce(function(acc, val) {
    //    var day = (new Date(val.date)).getDay();
    //    (acc[day] = acc[day] || []).push(val);
    //    return acc;
    //}, [])
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
    // myChart.defaultColors = [
    //     new dimple.color('#F18770'),
    //     new dimple.color('#A45FAA'),
    //     new dimple.color('#4CB0B9'),
    //     new dimple.color('#00a98c')
    // ];
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

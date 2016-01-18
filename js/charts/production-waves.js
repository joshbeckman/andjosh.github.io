var width = document.body.clientWidth - 60,
    height = Math.min(width - 200, window.innerHeight) - 200,
    loading = document.getElementById('loading'),
    svg = dimple.newSvg('#chartContainer', width, height),
    name = window.prompt('What\'s the password?', ''),
    domain = 'http://' + name + '.fulfill.co';

function drawData(data) {
    var myChart = new dimple.chart(svg, data),
        today = new Date(),
        myLegend,
        filterValues,
        x, y,
        s;

    loading.innerHTML = '';
    myChart.setBounds(60, 30, width - 100, height - 100);
    x = myChart.addTimeAxis('x', 'date', '%Y-%m-%d', '%Y/%m/%d');
    x.addOrderRule('Date');
    x.ticks = 10;
    y = myChart.addMeasureAxis('y', 'quantity');
    s = myChart.addSeries('category', dimple.plot.line);
    s.interpolation = 'cardinal';
    myLegend = myChart.addLegend(60, 10, width - 100, 20, 'right');
    myChart.draw();
    myChart.legends = [];
    svg.selectAll("title_text")
        .data(["Click legend to","show/hide category:"])
        .enter()
        .append("text")
        .attr("x", 100)
        .attr("y", function (d, i) { return 10 + i * 10; })
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("color", "Black")
        .text(function (d) { return d; });
    svg.append("line")
        .attr("x1", x._scale(today))
        .attr("x2", x._scale(today))
        .attr("y1", y._scale.range()[0])
        .attr("y2", y._scale.range()[1])
        .style('stroke', 'blueviolet');
    svg.append("text")
        .attr("x", x._scale(today) + 1)
        .attr("y", y._scale.range()[1] - 2)
        .text('Today')
        .style('font-size', '10px')
        .style('stroke', 'blueviolet');

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

(function getMovements() {
    var d = new Date(),
        month = d.getMonth(),
        year = d.getFullYear(),
        f, p,
        name,
        start,
        meta;

    if (month > 0) {
        d.setMonth(month - 1);
    } else {
        d.setMonth(11);
        d.setFullYear(year - 1);
    }

    p = d.toJSON().slice(0, 10);
    d = new Date();

    if (month < 11) {
        d.setMonth(month + 1);
    } else {
        d.setMonth(0);
        d.setFullYear(year + 1);
    }

    f = d.toJSON().slice(0, 10);
    loading.textContent = 'Loading.';
    start = domain + '/api/v1/movement' +
        '?orderby=-ends_at&limit=1000&ends_at__range=' + p + ',' + f;
    makeRequests(start, function(data) {
        transformData(data, drawData);
    });
})();

function makeRequests(url, cb, data) {
    data = data || [];
    request(url, function(err, resp, xhr) {
        resp = JSON.parse(resp);
        meta = resp.meta;
        data = data.concat(resp.data);
        loading.textContent = 'Loading... ' +
            Math.round((data.length / meta.count) * 100) + '% complete';
        if (meta.next) {
            makeRequests(domain + meta.next, cb, data);
        } else {
            cb(data);
        }
    });
}

function transformData(data, cb) {
    var results = [],
        item,
        d, i;

    for (i = 0; i < data.length; i++) {
        item = data[i];
        d = (new Date(item.ends_at)).toJSON().slice(0, 10);
        results.push({
            category:   'Movements ending',
            quantity:   1,
            date:       d
        });
        results.push({
            category:   'Units going to production',
            quantity:   item.sold,
            date:       d
        });
    }

    cb(results);
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

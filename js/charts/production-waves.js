var width = document.body.clientWidth - 60,
    height = Math.min(width - 200, window.innerHeight) - 200,
    svg = dimple.newSvg('#chartContainer', width, height);

function drawData(data) {
    var myChart = new dimple.chart(svg, data),
        myLegend,
        filterValues,
        x,
        s;

    myChart.setBounds(60, 30, width - 100, height - 100);
    x = myChart.addCategoryAxis('x', 'date');
    x.addOrderRule('Date');
    myChart.addMeasureAxis('y', 'quantity');
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
        name,
        start,
        meta;

    name = window.prompt('What\'s the name?', '');
    d.setMonth(d.getMonth() + 1);
    d = d.toJSON().slice(0, 10);
    start = 'http://' + name + '.fulfill.co/api/v1/movement' +
        '?orderby=-ends_at&limit=500&ends_at__lt=' + d;
    request(start, function(err, data, xhr) {
        data = JSON.parse(data);
        meta = data.meta;
        data = data.data;
        transformData(data, drawData);
    });
})();

function transformData(data, cb) {
    var results = [],
        item,
        d, i;

    for (i = 0; i < data.length; i++) {
        item = data[i];
        d = (new Date(item.ends_at)).toJSON().slice(0, 10);
        results.push({
            category:   'movements',
            quantity:   1,
            date:       d
        });
        results.push({
            category:   'units',
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

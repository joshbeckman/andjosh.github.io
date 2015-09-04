(function(window, document) {
    var drones = {
        targetDaily:            [],
        countryDaily:           [],
        deathsNumberDaily:      [],
        deathsTypeDaily:        [],
        rangeStart:     new Date(),
        rangeEnd:       new Date()
    };

    drones.pushTarget = function(strike) {
        var d = new Date(strike.date),
            name = strike.target || 'Unknown',
            names = name.split(', ')[0].split('; '),
            comp = '',
            pushed = false,
            s,
            n;

        for (n in names) {
            name = names[n];
            for (s in drones.targetDaily) {
                comp = drones.targetDaily[s].name || 'Unknown';
                if (comp == name) {
                    pushed = true;
                    drones.targetDaily[s].dates.push(d);
                }
            }

            if (!pushed) {
                drones.targetDaily.push({
                    name:   name,
                    dates:  [d]
                });
            }

            console.log('pushTarget', name);
        }
    };

    drones.build = function() {
        var width = document.body.clientWidth - 60,
            eventDropsChart = d3.chart.eventDrops()
                .hasBottomAxis(false)
                .hasDelimiter(false)
                .eventLineColor('red')
                .width(width)
                .start(drones.rangeStart);

        d3.select('#chartContainer1')
            .datum(drones.targetDaily)
            .call(eventDropsChart);
    };

    drones.load = function(data) {
        var strikes = data.strike;

        document.getElementById('chartContainer1').innerHTML =
            strikes.length + ' drone strikes conducted by the United States military.';
        for (var s in strikes) {
            drones.pushTarget(strikes[s]);
            drones.rangeStart = new Date(
                Math.min(
                    drones.rangeStart.getTime(),
                    (new Date(strikes[s].date))
                )
            );
        }
        drones.build();
    };

    window.drones = window.drones || drones;
})(this, this.document);

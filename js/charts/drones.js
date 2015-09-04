(function(window, document) {
    var drones = {
        targetDaily:            [],
        countryDaily:           [],
        deathsNumberDaily:      [],
        deathsTypeDaily:        [
                {name: 'Strikes Killing Targets', dates: []},
                {name: 'Strikes Killing Civilians', dates: []},
                {name: 'Strikes Injuring Civilians', dates: []},
                {name: 'Strikes Killing Children', dates: []}
            ],
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
        }
    };

    drones.pushCountry = function(strike) {
        var d = new Date(strike.date),
            name = strike.country,
            comp = '',
            pushed = false,
            s,
            n;

        for (s in drones.countryDaily) {
            comp = drones.countryDaily[s].name;
            if (comp == name) {
                pushed = true;
                drones.countryDaily[s].dates.push(d);
            }
        }

        if (!pushed) {
            drones.countryDaily.push({
                name:   name,
                dates:  [d]
            });
        }
    };

    drones.pushDeaths = function(strike) {
        var d = new Date(strike.date),
            dead = parseInt(strike.deaths_max, 10),
            civil = parseInt(strike.civilians, 10),
            child = parseInt(strike.children, 10),
            injury = parseInt(strike.injuries, 10),
            target = dead - civil;

        if (child) drones.deathsTypeDaily[3].dates.push(d);
        if (target) drones.deathsTypeDaily[0].dates.push(d);
        if (civil) drones.deathsTypeDaily[1].dates.push(d);
        if (injury) drones.deathsTypeDaily[2].dates.push(d);
    };

    drones.build = function() {
        var width = document.body.clientWidth - 60,
            eventDropsChart = d3.chart.eventDrops()
                .hasBottomAxis(false)
                .hasDelimiter(false)
                .width(width)
                .start(drones.rangeStart);

        d3.select('#chartTargets')
            .datum(drones.targetDaily)
            .call(eventDropsChart
                .eventLineColor('steelblue')
            );
        d3.select('#chartDeathsType')
            .datum(drones.deathsTypeDaily)
            .call(eventDropsChart
                .eventLineColor('firebrick')
            );
        d3.select('#chartCountry')
            .datum(drones.countryDaily)
            .call(eventDropsChart
                .eventLineColor('green')
            );
    };

    drones.load = function(data) {
        var strikes = data.strike;

        document.getElementById('loading').innerHTML = '';
        document.getElementById('chartContainer1').innerHTML =
            strikes.length + ' drone strikes conducted by the United States military.' +
            ' Sourced, with thanks, from <a href="http://dronestre.am">dronestre.am</a>';
        for (var s in strikes) {
            drones.pushTarget(strikes[s]);
            drones.pushDeaths(strikes[s]);
            drones.pushCountry(strikes[s]);
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

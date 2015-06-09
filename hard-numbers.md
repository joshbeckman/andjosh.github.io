---
layout: page
title: Hard Numbers
permalink: /hard-numbers/
---
When you're leading a team of developers for a startup company, you often get
asked about hard numbers. You get asked questions like:

> How much money would it take you to build the ideal solution?

> How much would it cost to build an MVP - a hard estimate?

> What if you hired twice as many people - how long would it then take?

I find those _hard_ to answer. I thought I could make a calculator to answer for
me.

It takes into account things like salary and a basic one-person development
time. It also hides some complexity like organizational debt and acquisition
cost. Play around and [let me know](mailto:email@andjosh.com) what you think or
would change.

---

<style type="text/css">
  label {
    display: block;
    padding: 1em 0 0.5em;
  }
</style>
<div id="div">
</div>
<script 
    src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.1/react-with-addons.js">
</script>
<script 
    src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.1/JSXTransformer.js">
</script>
<script type="text/jsx">
    var _numbers = window._numbers || {
                elements:       {}
            },
        acCost =        0.15, // salaries
        acDelay =       0.2, // months
        HardForm,
        ResponsiveInput,
        MultiplierSelect,
        Cost,
        Time;

    HardForm = React.createClass({
        getInitialState: function() {
            return {
                people:         1,
                days:           6,
                multiplier:     30.4,
                salary:         60000,
                time:           6,
                cost:           '30,000'
            }
        },
        calcCost:       function(people, salary, days, mult) {
            people = people || this.state.people;
            salary = salary || this.state.salary;
            days = days || this.state.days;
            mult = mult || this.state.multiplier;
            var cost = _numbers.calcCost(
                        people,
                        salary,
                        (days * mult)
                    );
            this.setState({
                people:         people,
                salary:         salary,
                days:           days,
                multiplier:     mult,
                cost:           cost
            });
            this.calcTime(people, salary, days, mult, cost);
        },
        calcTime:       function(people, salary, days, mult, cost) {
            people = people || this.state.people;
            salary = salary || this.state.salary;
            cost = cost || this.state.cost;
            days = days || this.state.days;
            mult = mult || this.state.multiplier;
            this.setState({
                people:         people,
                salary:         salary,
                cost:           cost,
                multiplier:     mult,
                days:           days,
                time:           _numbers.calcTime(
                        people,
                        (days * mult)
                    )
            });
        },
        daysCalcCost:           function(e) {
            this.calcCost(null, null, e.target.value);
        },
        multiplierCalcCost:     function(e) {
            this.calcCost(null, null, null, e.target.value);
        },
        peopleCalcCost:         function(e) {
            this.calcCost(e.target.value);
        },
        salaryCalcCost:         function(e) {
            this.calcCost(null, e.target.value);
        },
        render:         function(){
            return (
                <div className="hardNumbers">
                    <label for="days">
                        Time required for one person to complete this:
                    </label>
                    <ResponsiveInput
                        name="days"
                        type="number"
                        onChange={this.daysCalcCost}
                        value={this.state.days}
                    />
                    <MultiplierSelect
                        value={this.state.multiplier}
                        onChange={this.multiplierCalcCost}
                    />
                    <label for="people">
                        Expected number of people working on this:
                    </label>
                    <ResponsiveInput
                        name="people"
                        type="number"
                        onChange={this.peopleCalcCost}
                        value={this.state.people}
                    />
                    <label for="salary">
                        Average annual salary of people working on this:
                    </label>
                    <ResponsiveInput
                        name="salary"
                        type="number"
                        step="1000"
                        onChange={this.salaryCalcCost}
                        value={this.state.salary}
                    />
                    <hr/>
                    <Cost
                        value={this.state.cost} 
                    />
                    <Time
                        value={this.state.time} 
                    />
                </div>
            );
        }
    });
    ResponsiveInput = React.createClass({
        getInitialState: function() {
            return {
                value:  this.props.value,
                label:  this.props.label
            };
        },
        render: function() {
            return (
                <input 
                    type={this.props.type} 
                    name={this.props.name}
                    id={this.props.name}
                    defaultValue={this.state.value} 
                    onChange={this.props.onChange}
                    step={this.props.step}
                />
            );
        }
    });
    MultiplierSelect = React.createClass({
        getInitialState:        function() {
            return {
                value:  this.props.value
            };
        },
        render:                 function() {
            return (
                <select
                    name="multiplier"
                    defaultValue={this.state.value}
                    onChange={this.props.onChange}
                >
                    <option value="1">days</option>
                    <option value="7.02">weeks</option>
                    <option value="30.4">months</option>
                    <option value="365">years</option>
                </select>
            );
        }
    });
    Cost = React.createClass({
        render: function() {
            return (
                <h3>
                    Funding: <code>{this.props.value}</code>
                </h3>
            );
        }
    });
    Time = React.createClass({
        render: function() {
            return (
                <h3>
                    Work for: <code>{this.props.value}</code> months
                </h3>
            );
        }
    });

    _numbers.setCookie = function(cname, cvalue, exdays) {
        var d = new Date()
            expires = 240000000;

        exdays = exdays || 360;
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };
    _numbers.getCookie = function(cname) {
        var name = cname + "=",
            ca = document.cookie.split(';'),
            c;

        for(var i=0; i<ca.length; i++) {
            c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
        }
        return "No cookie present";
    };
    _numbers.calcTime = function(people, days) {
        return Math.round(((days / people) / 365) * 12) + Math.round((people - 1) * acDelay);
    };
    _numbers.calcCost = function(people, salary, days) {
        var time = days / people,
            timeOfYear = time / 365,
            cost = salary * timeOfYear,
            acQ = (acCost * (people - 1)) * salary,
            totalCost = (cost * people) + acQ;

        return (Math.round(totalCost / 1000) * 1000).formatMoney(0, '.', ',');
    };
    _numbers.gogo = function() {
        _numbers.elements = {
            form:       React.createElement(HardForm)
        };
        React.render(
            _numbers.elements.form,
            document.getElementById('div')
        );
    }
    window.addEventListener('load', _numbers.gogo);

    Number.prototype.formatMoney = function(c, d, t){
        var n = this, 
            c = isNaN(c = Math.abs(c)) ? 2 : c, 
            d = d == undefined ? "." : d, 
            t = t == undefined ? "," : t, 
            s = n < 0 ? "-" : "", 
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
</script>

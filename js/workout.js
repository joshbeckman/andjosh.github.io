(function(window, document){

    var wI = document.getElementsByName('weight')[0],
        rI = document.getElementsByName('reps')[0],
        we = document.getElementsByName('week')[0],
        orm= document.getElementsByName('orm')[0],
        txt = document.getElementsByName('scratch')[0],
        table = document.getElementsByTagName('table')[0],
        base = 0,
        week = 1,
        weeks = [
            {
                title: "Week 1: <small>5 reps each</small>",
                rates: [0.60, 0.65, 0.75, 0.75]
            },
            {
                title: "Week 2: <small>4 reps each</small>",
                rates: [0.65, 0.75, 0.85, 0.85]
            },
            {
                title: "Week 3: <small>3 reps each</small>",
                rates: [0.70, 0.80, 0.90, 0.90]
            },
            {
                title: "Week 4: <small>10 reps each</small>",
                rates: [0.40, 0.50, 0.60, 0.60]
            }
        ];

    calcOrm();
    readScratch();
    wI.addEventListener('change', calcOrm, false);
    rI.addEventListener('change', calcOrm, false);
    we.addEventListener('change', calcWeek, false);
    txt.addEventListener('change', saveCookie, false);

    function calcOrm (){
        base = Math.round(
            (
                wI.value / (
                    1.0278 - ( 0.0278 * rI.value ) ) * 
                week
            )
        );
        orm.innerHTML = base;
        calcDays();
    }
    function calcWeek (){
        var w = parseInt(we.value, 10) - 1,
            cap = table.getElementsByTagName('caption')[0],
            cells = table.getElementsByTagName('td'),
            heads = table.getElementsByTagName('th');
    
        w = weeks[w];
        cap.innerHTML = w.title;
        for (var i = 0; i < w.rates.length; i++) {
            cells[i].dataset.val = w.rates[i];
            heads[i].innerHTML = 100 * w.rates[i] + "%";
        }
        calcDays();
    }
    function calcDays (){
        var cells = document.getElementsByTagName('td');
        for (var i = 0; i < cells.length; i++) {
            cells[i].innerHTML = ofORM(
                parseFloat(cells[i].dataset.val, 10)
            );
        }
    }
    function ofORM(x){
        return Math.round( ( x * base ) / 5 ) * 5;
    }
    function saveCookie(){
        setCookie('wkScratch', txt.value);
    }
    function readScratch(){
        txt.value = getCookie('wkScratch');
    }
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        exdays = exdays || 360;
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
        }
        return "Anything you type here will show up when you return (like your previous weights)";
    }
})(this, this.document);

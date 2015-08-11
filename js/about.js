(function(window, document) {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        w = window.innerWidth,
        h = window.innerHeight,
        places = [
            //[21, 21],
            //[21, (h - (h % 20) + 1)],
            [(w - (w % 20) + 1), ((h * 2) - ((h * 2) % 20) + 1)],
            [(w - (w % 20) + 1), 21]
        ];

    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.zIndex = -1;
    canvas.style.top =
        canvas.style.left = 0;
    canvas.setAttribute('width', w * 2);
    canvas.setAttribute('height', h * 2);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    setInterval(drawPlaces, 33);

    canvas.addEventListener('click', function(evt) {
        var url = canvas.toDataURL('image/png');

        window.andjoshWindow = window.open(url, 'andjoshWindow');
    });

    function drawPlaces() {
        for (var i = 0; i < places.length; i++) {
            drawNext(places[i]);
        }
    }

    function drawNext(place) {
        context.beginPath();
        context.moveTo(place[0], place[1]);
        walk(place);
        context.lineTo(place[0], place[1]);
        context.strokeStyle = color();
        context.stroke();
    }

    function walk(place) {
        var old = place.slice(0),
            r = Math.random();

        if (r < 0.25) {
            place[0] -= 20;
        } else if (r < 0.5) {
            place[1] -= 20;
        } else if (r < 0.75) {
            place[0] += 20;
        } else {
            place[1] += 20;
        }

        if ((place[0] < 0) || (place[0] > (w * 2))) {
            place[0] = old[0];
        }

        if ((place[1] < 0) || (place[1] > (h * 2))) {
            place[1] = old[1];
        }
    }

    function color() {
        var ti = (new Date()).getTime(),
            i = parseInt(ti.toString()[ti.toString().length - 5], 10),
            r = Math.floor(Math.sin(i) * 127 + 128),
            g = Math.floor(Math.sin(i + 2) * 127 + 128),
            b = Math.floor(Math.sin(i + 3) * 127 + 128);

        return 'rgb(' + r + ', ' + g + ',' + b + ')';
    }
})(this, this.document);

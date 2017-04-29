/*! AnchorJS - v0.1.0 - 2014-08-17 | https://github.com/bryanbraun/anchorjs | Copyright (c) 2014 Bryan Braun; Licensed MIT */function addAnchors(e){e=e||"h1, h2, h3, h4, h5, h6";var t=document.querySelectorAll(e);for(var n=0;n<t.length;n++){var r;if(t[n].hasAttribute("id")){r=t[n].getAttribute("id")}else{var i=document.body.textContent?"textContent":"innerText";var s=t[n][i];tidyText=s.replace(/\s+/g,"-").toLowerCase();t[n].setAttribute("id",tidyText);r=tidyText}var o='<a class="anchor" href="#'+r+'"><span class="octicon octicon-link"></span></a>';t[n].innerHTML=t[n].innerHTML+o}}addAnchors('.content h2, .content h3, .content h4, .content h5');
function expandPre(){for(var e,n=document.querySelectorAll(".highlight"),i=window.innerWidth,t=0;t<n.length;t++)e=Math.max(0,i-n[t].clientWidth),n[t].style.margin="0 -"+e/2+"px 16px",n[t].children[0].style.padding="20px "+e/2+"px"}
//expandPre();

function expandImg() {
    var c = document.querySelector('.photos'),
        imgs = c ? c.querySelectorAll('img') : [],
        w = window.innerWidth,
        p = Math.min(1000, w);

    for (var i = 0; i < imgs.length; i++) {
        imgs[i].style.maxWidth = p + 'px';
        imgs[i].style.marginLeft =
            (Math.min(c.clientWidth - (Math.min(imgs[i].clientWidth, p)), 0) / 2) + 'px';
    }
}

window.addEventListener('load', expandImg, false);

function color2(num, ti) {
    ti = ti ? (new Date(ti)).toJSON() : (new Date).toJSON();
    i = parseInt(ti.slice(8, 10), 10);
    var r = Math.abs(num - Math.floor( Math.sin(i) * 127 + 28 ));
    var g = Math.abs(num - Math.floor( Math.sin(i + 2) * 127 + 28 ));
    var b = Math.abs(num - Math.floor( Math.sin(i + 3) * 127 + 28 ));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
0 && (function(window, document) {
    var pubTime = document.querySelector('.header .meta'),
        title = document.querySelector('.header h1'),
        header = document.querySelector('.header');

    if (pubTime) {
        pubTime = pubTime.textContent;
        document.querySelector('.header .meta').style.color = 'white';
    }
    title.style.color = 'white';
    title.style.zIndex = '2';
    header.style.backgroundColor = color2(25, pubTime);
    header.style.backgroundImage =
        'linear-gradient(90deg, ' + color2(25, pubTime) +
        ', ' + color2(0, pubTime) + ')';
    header.setAttribute('data-one', color2(25, pubTime));
    header.setAttribute('data-two', color2(0, pubTime));
})(this, this.document);
function bouncyBall() {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        header = document.querySelector('.header'),
        title = header.querySelector('h1'),
        lt = title.offsetLeft * 2,
        tt = title.offsetTop * 2,
        rt = lt + title.clientWidth * 2,
        bt = tt + title.clientHeight * 2,
        w = header.clientWidth,
        h = header.clientHeight,
        color = header.style.backgroundColor,
        ix = w * 2,
        iy = 0,
        data = [
            //[21, 21],
            //[21, (h - (h % 20) + 1)],
            //[(w - (w % 20) + 1), ((h * 2) - ((h * 2) % 20) + 1)],
            [(w - (w % 20) + 1), 21]
        ];

    context.scale(2, 2);
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.top =
        canvas.style.left = 0;
    canvas.setAttribute('width', w * 2);
    canvas.setAttribute('height', h * 2);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    context.strokeStyle = context.fillStyle = 'rgba(255,255,255,0.25)';
    context.lineWidth = 2;

    var xfunc = minus,
        yfunc = minus,
        velocity = [],
        xc = Math.round(Math.random() * 50),
        yc = Math.round(Math.random() * 50);

    var interval = setInterval(tick, 1000/33);
    canvas.addEventListener('click', stop);
 
    function tick() {
        context.beginPath();
        context.moveTo(ix, iy);
        if (ix > (w * 2)) {
            xfunc = minus;
        }
        if (ix < 0) {
            xfunc = plus;
        }
        if (iy > (h * 2)) {
            yfunc = minus;
        }
        if (iy < 0) {
            yfunc = plus;
        }
        if ((ix > lt) && (ix < rt)) {
            if ((iy < bt) && (iy > tt)) {
            }
        }
        velocity = [ix, iy];
        ix = xfunc(ix, xc);
        iy = yfunc(iy, yc);
        velocity[0] -= ix;
        velocity[1] -= iy;
        context.lineTo(ix, iy);
        context.stroke();
    }
    function minus(v, n) {
        return v -= n;
    }
    function plus(v, n) {
        return v += n;
    }
    function stop() {
        if (!interval) {
            interval = setInterval(tick, 1000/33);
            return;
        }
        clearInterval(interval);
        interval = null;
    }
    window.canvas = canvas;
}
//bouncyBall();
function constellation() {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        header = document.querySelector('.header'),
        title = header.querySelector('h1'),
        w = header.clientWidth,
        h = header.clientHeight,
        color = header.style.backgroundColor,
        ix = w * 2,
        iy = 0,
        vy = 0,
        vx = 0,
        gr = 1,
        drawn = [],
        data = [];

    context.scale(2, 2);
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.cursor = 'pointer';
    canvas.style.top =
        canvas.style.left = 0;
    canvas.setAttribute('width', w * 2);
    canvas.setAttribute('height', h * 2);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    context.strokeStyle = context.fillStyle = 'rgba(255,255,255,0.25)';
    var lg = context.createLinearGradient(0, 0, w * 2, 0);
    lg.addColorStop(0, header.dataset.one);
    lg.addColorStop(1, header.dataset.two);
    context.fillStyle = lg;
    context.lineWidth = 2;

    for (var i = w; i >= 0; i--) {
        data.push([
            Math.round(Math.random() * w * 2),
            Math.round(Math.random() * h * 2)
        ]);
    }
    var interval = setInterval(tick, 1000/33),
        dropped = false;
    canvas.addEventListener('click', stop);
 
    function tick() {
        i++;
        if (i > w) {
            i = 0;
        }
        context.beginPath();
        context.arc(data[i][0], data[i][1], 1, 0, 2 * Math.PI);
        context.stroke();
        drawn.push([data[i][0], data[i][1], vx, vy]);
    }
    function drop() {
        context.fillRect(0, 0, w * 2, h * 2);
        for (var i = drawn.length - 1; i >= 0; i--) {
            drawn[i][0] += drawn[i][2];
            drawn[i][1] += drawn[i][3];
            if (drawn[i][1] > (h * 2)) {
                drawn[i][2] *=  0.75;
                drawn[i][3] *= -0.6;
            }
            drawn[i][3] += gr;
            context.beginPath();
            context.arc(drawn[i][0], drawn[i][1], 1, 0, 2 * Math.PI);
            context.stroke();
        }
    }
    function stop() {
        clearInterval(interval);
        if (dropped) {
            interval = setInterval(tick, 1000/33);
            dropped = false;
            return;
        }
        interval = setInterval(drop, 1000/33);
        dropped = true;
    }
    window.canvas = canvas;
}
//constellation();
console.info('Want to see something fun? Try `constellation()` or `bouncyBall()`');

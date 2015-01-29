(function(window, document){
      var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        height = canvas.parentNode.clientHeight*2,
        width = canvas.parentNode.clientWidth*2,
        limit = width/2,
        radius = Math.sqrt(width / 2 * width / 2 + height / 2 * height / 2) + 5,
        theta = Math.PI * (3 - Math.sqrt(5)),
        spacing = 10 + Math.log((new Date).getHours()+1),
        size = 4,
        speed = 1,
        index = 0,
        total = (radius * radius) / (spacing * spacing),
        vendor = ["", "-webkit-", "-moz-", "-ms-", "-o-"]
          .reduce(function(p, v) { return v + "transform" in document.body.style ? v : p; });
      canvas.height = canvas.width = radius * 2;
      canvas.style.left = width / 2 - radius + "px";
      canvas.style.top = height / 2 - radius + "px";
      canvas.style.width = limit + 'px';
      canvas.width = radius * 2;
      canvas.height = radius * 2;
      canvas.style[vendor + "transform-origin"] = radius + "px " + radius + "px";
      context.translate(radius, radius);
      function color() {
        var ti = (new Date).getTime();
          i = parseInt(ti.toString()[ti.toString().length - 5], 10);
          var r = Math.floor( Math.sin(i) * 127 + 128 );
          var g = Math.floor( Math.sin(i + 2) * 127 + 128 );
          var b = Math.floor( Math.sin(i + 3) * 127 + 128 );
          return 'rgb(' + r + ', ' + g + ',' + b + ')';
      }
      setInterval(function() {
        for (var j = 0; index < total && j < speed; ++j) {
          var radius = spacing * Math.sqrt(++index),
              angle = index * theta,
              x = radius * Math.cos(angle),
              y = radius * Math.sin(angle);
          context.beginPath();
          context.arc(x, y, size, 0, 2 * Math.PI);
          context.fillStyle = context.strokeStyle = color();
          context.stroke();
          context.fill();
        }
      }, 1000/60);
      canvas.addEventListener('click', function(evt){
        var url = canvas.toDataURL("image/png");
        window.andjoshWindow = window.open(url, 'andjoshWindow');
      });
    })(this, this.document);

(function(window, document) {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        html = document.querySelector('html'),
        w = html.clientWidth,
        h = html.clientHeight,
        t = (new Date()).getTime(),
        boids = {},
        places = [
            //[21, 21],
            //[21, (h - (h % 20) + 1)],
            //[(w - (w % 20) + 1), ((h * 2) - ((h * 2) % 20) + 1)],
            [(w - (w % 20) + 1), 21]
        ];

    context.scale(2, 2);
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.zIndex = -1;
    canvas.style.top =
        canvas.style.left = 0;
    canvas.setAttribute('width', w * 2);
    canvas.setAttribute('height', h * 2);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.cursor = 'pointer';
    boids = Boids({
        boids: 200,
        speedLimit: 1,
        cohesionForce: 0.25,
        attractors: [[
            Math.random() * canvas.width
          , Math.random() * canvas.height
          , Math.max(canvas.width, canvas.height) // dist
          , Math.random() // spd
        ]]
    });

    setInterval(tickBoids, 1000/33);
    setInterval(replaceAttractor, 1000 * 10);

    canvas.addEventListener('click', function(evt) {
        var url = canvas.toDataURL('image/png');

        window.andjoshWindow = window.open(url, 'andjoshWindow');
    });

    function replaceAttractor() {
        boids.attractors.pop();
        boids.attractors.push([
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.max(canvas.width, canvas.height),
            Math.random()
        ]);
        context.strokeStyle = context.fillStyle = 'black';
        context.beginPath();
        context.arc(
            boids.attractors[0][0],
            boids.attractors[0][1],
            50,
            0,
            (2 * Math.PI)
        );
        context.fill();
    }

    function tickBoids() {
        var boidData = boids.boids,
            halfHeight = canvas.height/2,
            halfWidth = canvas.width/2;

        context.fillStyle = 'rgba(255, 255, 255, 0.1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = context.fillStyle = color();
        for (var i = 0, l = boidData.length, x, y; i < l; i += 1) {
            x = boidData[i][0];
            y = boidData[i][1];
            // wrap around the screen
            boidData[i][0] = x > halfWidth ? -halfWidth : -x > halfWidth ? halfWidth : x;
            boidData[i][1] = y > halfHeight ? -halfHeight : -y > halfHeight ? halfHeight : y;
            context.beginPath();
            context.arc(
                x * 20 + halfWidth,
                y * 20 + halfHeight,
                (Math.abs(boidData[i][4]) + Math.abs(boidData[i][5])) * 10,
                0,
                (2 * Math.PI)
            );
            context.fill();
            //context.fillRect(x * 20 + halfWidth, y * 20 + halfHeight, 10, 10);
        }
        if (Math.random() > 0.25) {
            
        }
        boids.tick();
    }

    function drawPlaces() {
        for (var i = 0; i < places.length; i++) {
            drawNext(places[i]);
        }
    }

    function drawNext(place) {
        context.beginPath();
        context.arc(place[0], place[1], (Math.random() * 10), 0, (2 * Math.PI));
        context.strokeStyle = context.fillStyle = color();
        context.fill();
        walk(place);
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

        if (r < 0.001) {
            places.push(place.slice(0));
        }
    }

    function color() {
        var ti = (new Date()).getTime();

        return 'hsl(' + (((ti - t) / 100) % 360) + ', 100%, 50%)';
    }

// Boids 2D
// https://github.com/hughsk/boids
var POSITIONX = 0
  , POSITIONY = 1
  , SPEEDX = 2
  , SPEEDY = 3
  , ACCELERATIONX = 4
  , ACCELERATIONY = 5

function Boids(opts) {
  if (!(this instanceof Boids)) return new Boids(opts)

  opts = opts || {}

  this.speedLimitRoot = opts.speedLimit || 0
  this.accelerationLimitRoot = opts.accelerationLimit || 1
  this.speedLimit = Math.pow(this.speedLimitRoot, 2)
  this.accelerationLimit = Math.pow(this.accelerationLimitRoot, 2)
  this.separationDistance = Math.pow(opts.separationDistance || 60, 2)
  this.alignmentDistance = Math.pow(opts.alignmentDistance || 180, 2)
  this.cohesionDistance = Math.pow(opts.cohesionDistance || 180, 2)
  this.separationForce = opts.separationForce || 0.15
  this.cohesionForce = opts.cohesionForce || 0.1
  this.alignmentForce = opts.alignmentForce || opts.alignment || 0.25
  this.attractors = opts.attractors || []

  var boids = this.boids = []
  for (var i = 0, l = opts.boids === undefined ? 50 : opts.boids; i < l; i += 1) {
    boids[i] = [
        Math.random()*25, Math.random()*25 // position
      , 0, 0                               // speed
      , 0, 0                               // acceleration
    ]
  }

}

Boids.prototype.tick = function() {
  var boids = this.boids
    , sepDist = this.separationDistance
    , sepForce = this.separationForce
    , cohDist = this.cohesionDistance
    , cohForce = this.cohesionForce
    , aliDist = this.alignmentDistance
    , aliForce = this.alignmentForce
    , speedLimit = this.speedLimit
    , accelerationLimit = this.accelerationLimit
    , accelerationLimitRoot = this.accelerationLimitRoot
    , speedLimitRoot = this.speedLimitRoot
    , size = boids.length
    , current = size
    , sforceX, sforceY
    , cforceX, cforceY
    , aforceX, aforceY
    , spareX, spareY
    , attractors = this.attractors
    , attractorCount = attractors.length
    , attractor
    , distSquared
    , currPos
    , length
    , target
    , ratio

  while (current--) {
    sforceX = 0; sforceY = 0
    cforceX = 0; cforceY = 0
    aforceX = 0; aforceY = 0
    currPos = boids[current]

    // Attractors
    target = attractorCount
    while (target--) {
      attractor = attractors[target]
      spareX = currPos[0] - attractor[0]
      spareY = currPos[1] - attractor[1]
      distSquared = spareX*spareX + spareY*spareY

      if (distSquared < attractor[2]*attractor[2]) {
        length = hypot(spareX, spareY)
        boids[current][SPEEDX] -= (attractor[3] * spareX / length) || 0
        boids[current][SPEEDY] -= (attractor[3] * spareY / length) || 0
      }
    }

    target = size
    while (target--) {
      if (target === current) continue
      spareX = currPos[0] - boids[target][0]
      spareY = currPos[1] - boids[target][1]
      distSquared = spareX*spareX + spareY*spareY

      if (distSquared < sepDist) {
        sforceX += spareX
        sforceY += spareY
      } else {
        if (distSquared < cohDist) {
          cforceX += spareX
          cforceY += spareY
        }
        if (distSquared < aliDist) {
          aforceX += boids[target][SPEEDX]
          aforceY += boids[target][SPEEDY]
        }
      }
    }

    // Separation
    length = hypot(sforceX, sforceY)
    boids[current][ACCELERATIONX] += (sepForce * sforceX / length) || 0
    boids[current][ACCELERATIONY] += (sepForce * sforceY / length) || 0
    // Cohesion
    length = hypot(cforceX, cforceY)
    boids[current][ACCELERATIONX] -= (cohForce * cforceX / length) || 0
    boids[current][ACCELERATIONY] -= (cohForce * cforceY / length) || 0
    // Alignment
    length = hypot(aforceX, aforceY)
    boids[current][ACCELERATIONX] -= (aliForce * aforceX / length) || 0
    boids[current][ACCELERATIONY] -= (aliForce * aforceY / length) || 0
  }
  current = size

  // Apply speed/acceleration for
  // this tick
  while (current--) {
    if (accelerationLimit) {
      distSquared = boids[current][ACCELERATIONX]*boids[current][ACCELERATIONX] + boids[current][ACCELERATIONY]*boids[current][ACCELERATIONY]
      if (distSquared > accelerationLimit) {
        ratio = accelerationLimitRoot / hypot(boids[current][ACCELERATIONX], boids[current][ACCELERATIONY])
        boids[current][ACCELERATIONX] *= ratio
        boids[current][ACCELERATIONY] *= ratio
      }
    }

    boids[current][SPEEDX] += boids[current][ACCELERATIONX]
    boids[current][SPEEDY] += boids[current][ACCELERATIONY]

    if (speedLimit) {
      distSquared = boids[current][SPEEDX]*boids[current][SPEEDX] + boids[current][SPEEDY]*boids[current][SPEEDY]
      if (distSquared > speedLimit) {
        ratio = speedLimitRoot / hypot(boids[current][SPEEDX], boids[current][SPEEDY])
        boids[current][SPEEDX] *= ratio
        boids[current][SPEEDY] *= ratio
      }
    }

    boids[current][POSITIONX] += boids[current][SPEEDX]
    boids[current][POSITIONY] += boids[current][SPEEDY]
  }

}

// double-dog-leg hypothenuse approximation
// http://forums.parallax.com/discussion/147522/dog-leg-hypotenuse-approximation
function hypot(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  var lo = Math.min(a, b)
  var hi = Math.max(a, b)
  return hi + 3 * lo / 32 + Math.max(0, 2 * lo - hi) / 8 + Math.max(0, 4 * lo - hi) / 16
}
})(this, this.document);

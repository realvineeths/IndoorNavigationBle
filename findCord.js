
(function() {
  var beacons, sqr;

  beacons = [];

  sqr = function(a) {
    return Math.pow(a, 2);
  };

  exports.vector = function(x, y) {
    return {
      x: x,
      y: y
    };
  };

  exports.setDistance = function(index, distance) {
    // console.log("in file",index,distance);
    beacons[index].dis = distance;
  };

  exports.addBeacon = function(index, position) {
    beacons[index] = position;
  };

  exports.calculatePosition = function() {
    var j, k, x, y;
    if (beacons.length < 3) {
      console.error("Error! Please add at least three beacons!");
      return exports.vector(0, 0);
    }
    k = (sqr(beacons[0].x) + sqr(beacons[0].y) - sqr(beacons[1].x) - sqr(beacons[1].y) - sqr(beacons[0].dis) + sqr(beacons[1].dis)) / (2 * (beacons[0].y - beacons[1].y)) - (sqr(beacons[0].x) + sqr(beacons[0].y) - sqr(beacons[2].x) - sqr(beacons[2].y) - sqr(beacons[0].dis) + sqr(beacons[2].dis)) / (2 * (beacons[0].y - beacons[2].y));
    j = (beacons[2].x - beacons[0].x) / (beacons[0].y - beacons[2].y) - (beacons[1].x - beacons[0].x) / (beacons[0].y - beacons[1].y);
    x = k / j;
    y = ((beacons[1].x - beacons[0].x) / (beacons[0].y - beacons[1].y)) * x + (sqr(beacons[0].x) + sqr(beacons[0].y) - sqr(beacons[1].x) - sqr(beacons[1].y) - sqr(beacons[0].dis) + sqr(beacons[1].dis)) / (2 * (beacons[0].y - beacons[1].y));

    return exports.vector(x, y);
  };

}).call(this);

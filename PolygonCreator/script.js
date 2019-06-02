
var points = [];
var orderedPoints = [];


//events
function addDot(event) {
  x = event.clientX;
  y = event.clientY;

  var canvas = document.getElementById("canvas");
  var rect = canvas.getBoundingClientRect();

  x -= rect.left;
  y -= rect.top;

  if(!movingDot) { //not moving the dot
    points.push([x, y]);
  } else { //moving the dot
    points[dotIndex][0] = x;
    points[dotIndex][1] = y;
  }

  console.log(movingDot);
  console.log(dotIndex);

  //reset var
  movingDot = false;
  dotIndex = -1;

  updateDisplay();
}


//display stuff

function clear() {
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawDots() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
ctx.fillStyle = "#9FBEF9";
ctx.strokeStyle = "#9FBEF9";
ctx.lineWidth = 5;
  for(i = 0; i < points.length; i++) {
    // ctx.fillRect(points[i][0],points[i][1],10,10);
    ctx.beginPath();
    ctx.arc(points[i][0], points[i][1], 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

  }
}

function drawLines() {
  //credit: rajat mittal
  if(points.length >= 3) {

    //starting dot is the dot the lowest on the screen

    startingIndex = -1;
    yVal = -10000000;
    for(i = 0; i < points.length; i++) {
      if(yVal < points[i][1]) {
        startingIndex = i;
        yVal = points[i][1];
      }
    }

    // console.log("min: " + startingIndex);

    //now calculates the angles from the dot to the other dots

    startingPoint = points[startingIndex];
    angles = [];
    indices = [];
    for(i = 0; i < points.length; i++) {

      if(i == startingIndex) { //if the dot being checked is the original point, add a 0 radian measure
        angles.push(0);
      } else {
        degree = Math.atan((-1*(points[i][1] - startingPoint[1])) / (points[i][0] - startingPoint[0]));
        degree *= 180/Math.PI;
        if(degree < 0) {
          degree += 180;
        }
        angles.push(degree); //finds angle between two dots and horizontal axis going through the starting dot
      }
      indices.push(i);
    }

    // console.log(angles);
    // console.log(indices);
    // console.log(points);

    //now apply basic selection sort, to sort from smallest angle to largest angle

    for(i = 0; i < angles.length-1; i++) {
      var selectedIndex = i;
      for(j = i + 1; j < angles.length; j++) {
        if(angles[j] < angles[selectedIndex]) {
          selectedIndex = j;
        }
      }
      tempAngle = angles[selectedIndex];
      tempIndex = indices[selectedIndex];

      angles[selectedIndex] = angles[i];
      indices[selectedIndex] = indices[i];

      angles[i] = tempAngle;
      indices[i] = tempIndex;
    }

    //update orderedPoints based on the new indices

    orderedPoints = [];

    for(i = 0; i < indices.length; i++) {
      orderedPoints.push(points[indices[i]]);
    }

    //finally, draw the lines

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");


    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 10;
    ctx.beginPath();

    ctx.moveTo(orderedPoints[0][0], orderedPoints[0][1]);

    for(i = 1; i < orderedPoints.length; i++) {
      ctx.lineTo(orderedPoints[i][0], orderedPoints[i][1]);
    } //skip the first, since it is the original dot

    ctx.closePath();

    //now draw back to the front

    //to fill the space in the shape
    ctx.fillStyle = "#9FBEF9";
    ctx.fill();
    //to draw a border
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

  }

}

function numDiagonals() {
  sides = points.length;

  if(sides >= 3) {
    diagonals = (sides * (sides - 3)) / 2;
    document.getElementById("diagonalnum").innerHTML = "number of diagonals: " + diagonals;
  } else {
    document.getElementById("diagonalnum").innerHTML = "number of diagonals: 0";
  }

}

function sumInteriorAngles() {
  sides = points.length;

  if(sides >= 3) {
    angle = 180 * (sides - 2);
    document.getElementById("anglesum").innerHTML = "sum of interior angles:  " + angle + "°";
  } else {
    document.getElementById("anglesum").innerHTML = "sum of interior angles: 0";
  }

}

function numSides() {
  sides = points.length;
  if(sides >= 3) {
    document.getElementById("sides").innerHTML = "sides: " + sides;
  } else {
    document.getElementById("sides").innerHTML = "sides: 0";
  }
}

function findArea() {
  sides = orderedPoints.length;
  if(sides >= 3) {
    area = 0;
    for(i = 0; i < orderedPoints.length; i++) {
      area += orderedPoints[i][0] * orderedPoints[(i+1)%sides][1];
      area -= orderedPoints[i][1] * orderedPoints[(i+1)%sides][0];
    }
    // console.log("area: " + area)
    area = Math.abs(area);
    area /= 2;
    area /= 25;
    // console.log(canvas.width);
    // console.log(canvas.height);
    document.getElementById("area").innerHTML = "area: " + area;

  } else {
    document.getElementById("area").innerHTML = "area: none";
  }
}

function drawCoordinateGrid() {
  //draw the dashes
  var c = document.getElementById("canvas");
  var ctx = c.getContext("2d");

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.font = "20px Arial";

  ctx.beginPath();

  for(i = 50; i <= canvas.width; i += 50) {
    //draw vertical
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();

      //draw horizontal
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();

      //now add the number
      ctx.fillStyle = "#000000";

      ctx.fillText(i/5, i-15, canvas.height - 10); //on the x axis
      ctx.fillText(i/5, 5, canvas.width - i + 5); //on the y axis


  }

    ctx.fillText(0, 5, canvas.height - 5); //on the x axis


}

function findType() {

  // console.log("*********************************************")
  sides = orderedPoints.length;

  isConvex = true;

  sum = 0;

  if(sides >= 3) {



    for(i = 0; i < orderedPoints.length; i++) { //for each point
      pointBefore = -1;
      //figures out the points connecting to the current point
      if(i == 0) {
        pointBefore = orderedPoints[orderedPoints.length-1];
      } else {
        pointBefore = orderedPoints[i-1];
      }
      pointAfter = orderedPoints[(i+1)%orderedPoints.length];

      //get the quadrants of the two vectors connecting the the point
      bQuad = getQuadrant(pointBefore[0] - orderedPoints[i][0], orderedPoints[i][1] - pointBefore[1]);
      aQuad = getQuadrant(pointAfter[0] - orderedPoints[i][0], orderedPoints[i][1] - pointAfter[1]);

      //now figure out angle measure of the two vectors with the horizontal axis

      bDegree = Math.atan(Math.abs(orderedPoints[i][1] - pointBefore[1]) / Math.abs(pointBefore[0] - orderedPoints[i][0])) * 180/Math.PI;
      aDegree = Math.atan(Math.abs(orderedPoints[i][1] - pointAfter[1]) / Math.abs(pointAfter[0] - orderedPoints[i][0])) * 180/Math.PI;

      //now get correct angle

      correctB = correctAngle(bDegree, bQuad);
      correctA = correctAngle(aDegree, aQuad);

      // console.log("B: " + correctB + " A: " + correctA);

      combine = 0;
      //if, while going clockwise, the measure between the before angle and after angle is > 180, then it is concave
      if(correctB >= correctA) {
        combine = correctB - correctA;
      } else {
        combine += correctB;
        correctB = 360;
        combine += correctB - correctA;
      }

      if(combine > 180) { //make sure the interior angle isn't greater than 180
        isConvex = false;
      }

      sum += combine;

    }

    if(isConvex) {
      document.getElementById("type").innerHTML = "type: convex";
      document.getElementById("anglesum").innerHTML = "sum of angles: " + sum; //also figures out angle

    } else {
      document.getElementById("type").innerHTML = "type: concave";
      document.getElementById("anglesum").innerHTML = "sum of angles: " + sum; //also figures out angle
    }


  } else {
    document.getElementById("type").innerHTML = "type: none";
  }
}

function correctAngle(angle, quadrant) {
  if(quadrant == 1) {
    return angle;
  } else if(quadrant == 2) {
    return 180 - angle;
  } else if(quadrant == 3) {
    return 180 + angle;
  } else if(quadrant == 4) {
    return 360 - angle;
  }
}

function getQuadrant(x, y) {
  if(x >= 0) {//1 or 4
    if(y >= 0) {
      return 1;
    } else {
      return 4;
    }
  } else { //2 or 3
    if(y >= 0) { //2
      return 2;
    } else { //3
      return 3;
    }
  }
}

function updateDisplay() {
    clear();
    drawDots();
    drawLines();
    numDiagonals();
    sumInteriorAngles();
    numSides();
    findArea();
    findType();
    drawCoordinateGrid();
}



var movingDot = false;
var dotIndex = -1;

$(document).mousedown(function(event) { //pressing mouse down handler
  //check to see if the mouse falls within any of the

  x = event.clientX;
  y = event.clientY;

  var canvas = document.getElementById("canvas");
  var rect = canvas.getBoundingClientRect();

  x -= rect.left;
  y -= rect.top;

  for(i = 0; i < points.length; i++) {
    if(Math.abs(x - points[i][0]) <= 5 && Math.abs(y - points[i][1]) <= 5) { //within range
      //dot found
      movingDot = true;
      dotIndex = i;
      break;
    }
  }

});

$(document).mousemove(function( event ) { //moving the mouse handler
  if(movingDot) {
    x = event.clientX;
    y = event.clientY;

    var canvas = document.getElementById("canvas");
    var rect = canvas.getBoundingClientRect();

    x -= rect.left;
    y -= rect.top;

    points[dotIndex][0] = x;
    points[dotIndex][1] = y;
    updateDisplay();
  }
});

$(document).keydown(function(event){ //keypress handler
    var keycode = event.keyCode ? event.keyCode : event.which;
    if(keycode == 82) { //r
      points = [];
      orderedPoints = [];
      movingDot = false;
      dotIndex = -1;
      updateDisplay();
    } else if(keycode == 66) {
      if(points.length >= 1) {
        removed = points.pop();
        for(i = 0; i < orderedPoints.length; i++) {
          if(orderedPoints[i][0] == removed[0] && orderedPoints[i][1] == removed[1]) {
            orderedPoints.splice(i);
            break;
          }
        }
        movingDot = false;
        dotIndex = -1;
        updateDisplay();
      }
    }
});

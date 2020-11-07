// sizing and spacing
const canvasHeight = 500;
const canvasWidth = 620;
const padding = 3;

const textHeight = 12;
const maxArrowHeight = 200;

const pointWidth = 3;

// coloring
const axisWeight = 3;
const axisColor = 0;
const referenceLineWeight = 1;
const textWeight = 1;
const textColor = 0;

const upSpinColor = [255, 204, 0];
const downSpinColor = [255, 255, 255];

// initial constants
var t;
const dt = 0.01;
var inputtedParams = {};
var runButtonPressed = false;

function drawAxesAndLabels() {
  fill(color(0,0,0));

  // draw axes
  strokeWeight(axisWeight);
  stroke(axisColor);
  // x axis
  line(0, height/2, width, height/2);
  line(width - 5, height/2 - 5, width, height/2);
  line(width - 5, height/2 + 5, width, height/2);
  // +/- 1 markers
  strokeWeight(referenceLineWeight);
  line(0, height/2 - maxArrowHeight, width, height/2 - maxArrowHeight);
  line(0, height/2 + maxArrowHeight, width, height/2 + maxArrowHeight);

  // axes labels
  strokeWeight(textWeight);
  stroke(textColor);
  textSize(textHeight);
  // x axis
  text('0', 0 + 5, height/2 + textHeight + padding);
  text('3', canvasWidth/2 - 5, height/2 + textHeight + padding);
  text('6', canvasWidth - 10, height/2 + textHeight + padding);
  // y axis
  text('P(upspin) = 1', padding, height/2 - maxArrowHeight - padding);
  text('P(downspin) = 1', padding, height/2 + maxArrowHeight + textHeight + padding);
}

function setup() {
  var cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.style('display', 'block');
  background(255, 255, 255);

  drawAxesAndLabels();
  stroke(0);
  t = 0;
}

function windowResized() {
  resizeCanvas(canvasWidth, canvasHeight);
}

function resetPlot() {
  setup();
}

function sendValuesAndRunSimulation() {
  inputtedParams {};
  var formObj = document.forms.namedItem("parameters");
  var inputs = formObj.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].name === 'mass' && inputs[i].value <= 0) {
      alert('Mass is strictly positive! Please update your values and try again.');
      return;
    }
    inputtedParams[inputs[i].name] = inputs[i].value;
  }
  console.log(inputtedParams);
  if (runButtonPressed) {
    resetPlot();
  } else {
    runButtonPressed = true;
  }
}

function draw() {
  if (runButtonPressed && t <= width){
    x = t;

    upSpinProbability = Math.sin(t*dt);

    upSpinY = height/2 - upSpinProbability * maxArrowHeight;
    downSpinY = height/2 + (1 - upSpinProbability) * maxArrowHeight;
    
    fill(color(upSpinColor[0], upSpinColor[1], upSpinColor[2]));
    noStroke();
    ellipse(t, upSpinY, pointWidth, pointWidth);
    // fill(downSpinColor)
    // ellipse(t, downSpinY, pointWidth, pointWidth);

    t+=1;
  }
}
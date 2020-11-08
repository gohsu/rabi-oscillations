import { main as calculateProb} from "./calculate_prob.js";
// sizing and spacing
const canvasHeight = 400;
const borderWeight = 5;
const plotWidth = 620;
const plotAndParticleAnimationPadding = 20;

const particleAnimationWidth = 300;
const particleX = plotWidth + plotAndParticleAnimationPadding + (particleAnimationWidth - borderWeight)/2;
const particleY = canvasHeight/2;
const particleRadius = 20;
const particleUpArrowStart = particleY - particleRadius;
const particleDownArrowStart = particleY + particleRadius;
const particleWeight = 1;
const particleArrowWeight = 5;

const canvasWidth = plotWidth + plotAndParticleAnimationPadding + particleAnimationWidth;

const padding = 4;

const textHeight = 16;
const maxArrowHeight = 150;

const pointWidth = 5;

// coloring
const axisWeight = 3;
const axisColor = 0;
const referenceLineWeight = 1;
const textWeight = 1;
const textColor = 0;

const plotAndParticleAnimationPaddingColor = [249, 244, 255]
const upSpinColor = [53, 0, 211];
const downSpinColor = [12, 0, 50];
const particleColor = [103, 61, 230]

// initial constants
var cnv;
var t;
const dt = 0.01;

var inputtedParams = {};
var isPlotting = false;

function drawAxesBase() {
  fill(color(255,255,255));
  strokeWeight(borderWeight);
  rect(borderWeight/2, borderWeight/2, plotWidth - borderWeight, canvasHeight - borderWeight, 25);
}

function drawAxesAndLabels() {
  fill(color(0,0,0));
  // draw axes
  strokeWeight(axisWeight);
  stroke(axisColor);
  // x axis
  line(0, height/2, plotWidth - borderWeight, height/2);
  // x axis arrows
  line(plotWidth - borderWeight - 10, height/2 - 10, plotWidth - borderWeight, height/2);
  line(plotWidth - borderWeight - 10, height/2 + 10, plotWidth - borderWeight, height/2);
  // +/- 1 markers
  strokeWeight(referenceLineWeight);
  line(0, height/2 - maxArrowHeight, plotWidth - borderWeight, height/2 - maxArrowHeight);
  line(0, height/2 + maxArrowHeight, plotWidth - borderWeight, height/2 + maxArrowHeight);

  // axes labels
  strokeWeight(textWeight);
  stroke(textColor);
  textSize(textHeight);
  // x axis
  text('0', padding + borderWeight, height/2 + textHeight + padding);
  text('3', plotWidth/2 - 10, height/2 + textHeight + padding);
  text('6', plotWidth - 20, height/2+ textHeight + padding);
  // y axis
  text('P(upspin) = 1', padding + borderWeight, height/2 - maxArrowHeight - 2*padding);
  text('P(downspin) = 1', padding + borderWeight, height/2 + maxArrowHeight + textHeight + padding);
}

function drawInitialAxesAndLabes() {
  drawAxesBase();
  drawAxesAndLabels();
}

function drawParticleAnimationBase() {
  fill(color(255,255,255));
  stroke(axisColor);
  strokeWeight(borderWeight);
  rect(
    plotWidth + plotAndParticleAnimationPadding,
    borderWeight/2,
    particleAnimationWidth - borderWeight,
    canvasHeight - borderWeight,
    25
  );
  
  strokeWeight(particleWeight);
  fill(color(particleColor[0], particleColor[1], particleColor[2]));
  ellipse(
    particleX,
    particleY,
    particleRadius*2
  );
  
}

function drawParticleAnimationArrows(upSpinY, downSpinY){
  strokeWeight(particleArrowWeight);

  if (upSpinY < particleUpArrowStart) {
    stroke(color(upSpinColor[0], upSpinColor[1], upSpinColor[2]));
    line(particleX, particleUpArrowStart, particleX, upSpinY);
    line(particleX - 10, upSpinY + 10, particleX, upSpinY);
    line(particleX + 10, upSpinY + 10, particleX, upSpinY);
  }
  if (downSpinY > particleDownArrowStart) {
    stroke(color(downSpinColor[0], downSpinColor[1], downSpinColor[2]));
    line(particleX, particleY + particleRadius, particleX, downSpinY);
    line(particleX - 10, downSpinY - 10, particleX, downSpinY);
    line(particleX + 10, downSpinY - 10, particleX, downSpinY);
  }

  fill(color(0,0,0));
}

function drawInitialParticleAnimation(){
  drawParticleAnimationBase();
  drawParticleAnimationArrows(
    particleUpArrowStart + particleRadius - 0.5*maxArrowHeight,
    particleDownArrowStart - particleRadius + 0.5*maxArrowHeight
  );
}

function setup() {
  cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.position(
    (windowWidth - canvasWidth)/2,
    document.getElementById('pageTitle').offsetHeight * 2
  );
  cnv.style('display', 'block');
  background(
    plotAndParticleAnimationPaddingColor[0],
    plotAndParticleAnimationPaddingColor[1],
    plotAndParticleAnimationPaddingColor[2]
  );

  drawInitialAxesAndLabes();
  drawInitialParticleAnimation();
  stroke(0);
  t = borderWeight;
}

function windowResized() {
  cnv.position(
    (windowWidth - canvasWidth)/2,
    document.getElementById('pageTitle').offsetHeight * 2
  );
}

function resetPlot() {
  setup();
}

function sendValuesAndRunSimulation() {
  inputtedParams = {};
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
  if (isPlotting) {
    resetPlot();
  } else {
    isPlotting = true;
  }
}

function pauseSimulation(){
  isPlotting = false;
}

function clearValuesAndPlot() {
  isPlotting = false;
  inputtedParams = {};
  resetPlot();
}

function drawPlot(t, upSpinY, downSpinY){
  noStroke();
  fill(color(upSpinColor[0], upSpinColor[1], upSpinColor[2]));
  ellipse(t, upSpinY, pointWidth, pointWidth);
  fill(color(downSpinColor[0], downSpinColor[1], downSpinColor[2]));
  ellipse(t, downSpinY, pointWidth, pointWidth);

  const fillColor = color(particleColor[0], particleColor[1], particleColor[2]);
  fillColor.setAlpha(255*0.2);
  stroke(fillColor);
  line(t, upSpinY + pointWidth, t, downSpinY - pointWidth);
}

function drawParticleAnimation(upSpinY, downSpinY){
  drawParticleAnimationBase();
  drawParticleAnimationArrows(upSpinY, downSpinY);
}

function draw() {
  if (isPlotting && t <= plotWidth - borderWeight){
    const {a, b, c, d, mass, charge, magnetic1, magnetic2, omega} = inputtedParams
    upSpinProbability = calculateProb(t, a, b, c, d, magnetic2, magnetic1, omega, mass, charge);

    upSpinY = height/2 - upSpinProbability * maxArrowHeight;
    downSpinY = height/2 + (1 - upSpinProbability) * maxArrowHeight;
    
    drawPlot(t, upSpinY, downSpinY)
    drawParticleAnimation(upSpinY, downSpinY);

    t+=1;
  }
}
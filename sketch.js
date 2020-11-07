function setup() {
  var cnv = createCanvas(windowWidth - 200, 500);
  cnv.style('display', 'block');
  background(255, 0, 200);
}

function windowResized() {
  resizeCanvas(windowWidth - 200, 500);
}

function draw() {
  background(255, 0, 200);
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}
let blink = false;
let blinkTimer = 0;
let smoothPupilLeft = { x: 0, y: 0 };
let smoothPupilRight = { x: 0, y: 0 };

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  angleMode(DEGREES);

  // SET INITIAL PUPIL POSITIONS
  smoothPupilLeft.x = 12.5;
  smoothPupilLeft.y = 0;
  smoothPupilRight.x = 12.5;
  smoothPupilRight.y = 0;

}

function draw() {
  // SOFT GRADIENT BACKGROUND FOR CONTRAST
  background(220, 20, 20);

  // DEFINE EYE POSITIONS TO BE CENTERED
  let eyeY = height / 2 - 30; // EYES POSITIONED SLIGHTLY ABOVE CENTER
  let leftX = width / 2 - 50;
  let rightX = width / 2 + 50;

  // CALCULATE ANGLES
  let leftAngle = atan2(mouseY - eyeY, mouseX - leftX);
  let rightAngle = atan2(mouseY - eyeY, mouseX - rightX);

  // SMOOTHLY INTERPOLATE PUPIL MOVEMENT
  smoothPupilLeft.x = lerp(smoothPupilLeft.x, cos(leftAngle) * 12.5, 0.2);
  smoothPupilLeft.y = lerp(smoothPupilLeft.y, sin(leftAngle) * 12.5, 0.2);
  smoothPupilRight.x = lerp(smoothPupilRight.x, cos(rightAngle) * 12.5, 0.2);
  smoothPupilRight.y = lerp(smoothPupilRight.y, sin(rightAngle) * 12.5, 0.2);

  // RANDOM EYE BLINK
  if (frameCount % 180 === 0) { 
    blink = true;
    blinkTimer = frameCount;
  }
  if (frameCount - blinkTimer > 10) {
    blink = false;
  }

  // DRAW LEFT EYE
  drawEye(leftX, eyeY, smoothPupilLeft.x, smoothPupilLeft.y, blink);

  // DRAW RIGHT EYE
  drawEye(rightX, eyeY, smoothPupilRight.x, smoothPupilRight.y, blink);

  // DRAW SMILE WITH INTEGRATED FANGS AT CENTERED POSITION
  drawFangedSmile(width / 2, eyeY + 70);
}

function drawEye(x, y, pupilX, pupilY, isBlinking) {
  push();
  translate(x, y);
  
  // EYE WHITES WITH A FIXED BRIGHT COLOR
  fill(255);
  stroke(0); 
  strokeWeight(2);
  ellipse(0, 0, 50, isBlinking ? 5 : 50); // SHRINK WHEN BLINKING
  
  // SHADOW EFFECT FOR DEPTH
  fill(0, 0, 0, 50);
  ellipse(3, 3, 50, isBlinking ? 5 : 50);
  
  // PUPIL - WHITE WITH A BLACK OUTLINE FOR CONTRAST
  if (!isBlinking) {
    fill(255);
    stroke(0);
    strokeWeight(2);
    ellipse(pupilX, pupilY, 20, 20);
  }

  pop();
}

function drawFangedSmile(x, y) {
  push();
  translate(x, y);

  // DRAW MOUTH OUTLINE
  fill(0);
  stroke(0);
  strokeWeight(2);
  arc(0, 0, 80, 40, 0, PI); // UPPER PART OF THE MOUTH

  // TEETH
  fill(255);
  arc(0, 0, 80, 30, 0, PI, CHORD);

  // FANGS
  fill(255);
  stroke(0);
  strokeWeight(2);

  // LEFT FANG
  beginShape();
  vertex(-20, 5);  // TOP OF FANG
  vertex(-15, 20); // BOTTOM POINT
  vertex(-10, 5);  // TOP
  endShape(CLOSE);

  // RIGHT FANG
  beginShape();
  vertex(10, 5);
  vertex(15, 20);
  vertex(20, 5);
  endShape(CLOSE);

  pop();
}

let table; // STORE THE DATASET
let organics = []; // HOLD ORGANIC OBJECTS
let change = 0; // ROTATION AND ANIMATION
let colorsPalette = []; // STORE COLORS FROM THE DATASET
let bgColor; // BACKGROUND COLOR

function preload() {
  // LOAD THE CSV FILE WITH MUTED PALETTE COLORS
  table = loadTable('muted_palette.csv', 'csv', 'header');
}

function setup() {
  createCanvas(800, 500);
  noStroke();
  loadColors(); // LOAD COLORS FROM THE DATASET
  calculateBackgroundColor(); // CALCULATE AVERAGE COLOR FOR BACKGROUND

  // CREATE ORGANIC OBJECTS WITH RANDOMIZED PROPERTIES
  for (let i = 0; i < 110; i++) {
    organics.push(
      new Organic(
        random(10, 100), // RANDOM RADIUS
        random(width), // RANDOM X POSITION
        random(height), // RANDOM Y POSITION
        random(5, 30), // ROUGHNESS
        random(TWO_PI), // ROTATION ANGLE
        colorsPalette[floor(random(colorsPalette.length))] // RANDOM COLOR FROM THE DATASET
      )
    );
  }
}

function draw() {
  background(bgColor); // SET BACKGROUND TO CALCULATED AVERAGE COLOR
  for (let i = 0; i < organics.length; i++) {
    organics[i].show(change); // DISPLAY EACH ORGANIC SHAPE
  }
  change += 0.01; // INCREMENT THE ROTATION/ANIMATION FACTOR
}

// LOAD COLORS FROM THE CSV DATASET INTO THE COLORS PALETTE ARRAY
function loadColors() {
  for (let i = 0; i < table.getRowCount(); i++) {
    let r = table.getNum(i, 'R');
    let g = table.getNum(i, 'G');
    let b = table.getNum(i, 'B');
    colorsPalette.push(color(r, g, b, 50)); // ADD TRANSPARENCY FOR LAYERING EFFECTS
  }
}

// CALCULATE THE AVERAGE RGB VALUES FROM THE DATASET FOR THE BACKGROUND COLOR
function calculateBackgroundColor() {
  let totalR = 0, totalG = 0, totalB = 0;
  let rowCount = table.getRowCount();

  for (let i = 0; i < rowCount; i++) {
    totalR += table.getNum(i, 'R');
    totalG += table.getNum(i, 'G');
    totalB += table.getNum(i, 'B');
  }

  // CALCULATE AVERAGES AND SET THE BACKGROUND COLOR
  let avgR = totalR / rowCount;
  let avgG = totalG / rowCount;
  let avgB = totalB / rowCount;
  bgColor = color(avgR, avgG, avgB, 50); // SLIGHT TRANSPARENCY FOR SOFTNESS
}

// ORGANIC CLASS TO DEFINE EACH BLOB
function Organic(radius, xpos, ypos, roughness, angle, color) {
  this.radius = radius; // RADIUS OF THE BLOB
  this.xpos = xpos; // X POSITION OF THE BLOB
  this.ypos = ypos; // Y POSITION OF THE BLOB
  this.roughness = roughness;
  this.angle = angle; // INITIAL ROTATION ANGLE
  this.color = color; // FILL COLOR FOR THE BLOB

  this.show = function (change) {
    noStroke(); // NO STROKE FOR A SMOOTH LOOK
    fill(this.color); // SET BLOB COLOR

    push();
    translate(this.xpos, this.ypos); // MOVE TO BLOB POSITION
    rotate(this.angle + change); // ROTATE BLOB OVER TIME
    beginShape();
    let off = 0;
    for (let i = 0; i < TWO_PI; i += 0.1) {
      let offset = map(noise(off, change), 0, 1, -this.roughness, this.roughness);
      let r = this.radius + offset;
      let x = r * cos(i);
      let y = r * sin(i);
      vertex(x, y);
      off += 0.1;
    }
    endShape(CLOSE); // COMPLETE THE BLOB SHAPE
    pop();
  };
}
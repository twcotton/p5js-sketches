const density = " .:-=+*#%@";
const charSize = 12;
let cols, rows;
let time = 0; // Used to animate the math
let gridCoords = new Set();
let griddedMouseX;
let griddedMouseY;

function setup() {
  createCanvas(600, 900);
  textFont('monospace');
  textSize(charSize);
  textAlign(CENTER, CENTER);

  cols = floor(width / charSize);
  rows = floor(height / charSize);


  // We leave looping ON for this one to see the animation
}

function draw() {
  background(10);
  fill(200, 200, 255);

  let griddedMouseX = round(mouseX / width * cols)
  let griddedMouseY = round(mouseY / height * rows)
  // console.log(mouseX / width)
  console.log(griddedMouseX)

  text("x", griddedMouseX * charSize + charSize / 2, griddedMouseY * charSize + charSize / 2);

  // for (let y = 0; y < rows; y++) {
  //   for (let x = 0; x < cols; x++) {

  //     let densityIndex = 1;
  //     // if (y = griddedMouseY) {
  //     //   if (x = griddedMouseX) {
  //     //     densityIndex = 0.99;
  //     //   }
  //     // }

  //     // combined is between -1 and 1. Map it to our density string index (0 to 9)
  //     let charIndex = floor(map(densityIndex, 0, 1, 0, density.length - 1));

  //     let charToDraw = density.charAt(charIndex);

  //     text(charToDraw, x * charSize + charSize / 2, y * charSize + charSize / 2);
  //   }
  // }

  let gridCoords = calculateCircle(32, 32, 12);

  time += 0.05; // Advance time to animate the waves
}

// Bresenham's Midpoint Circle Algorithm
function calculateCircle(cx, cy, r) {
  let gridCoords = new Set();

  let x = 0;
  let y = r;

  // The decision parameter determines whether to step diagonally or straight
  let decision = 3 - 2 * r;

  addSymmetry(cx, cy, x, y);

  // Loop until the octant crosses the 45-degree line (when x becomes > y)
  while (y >= x) {
    x++;

    if (decision > 0) {
      y--;
      decision = decision + 4 * (x - y) + 10;
    } else {
      decision = decision + 4 * x + 6;
    }

    addSymmetry(cx, cy, x, y);
  }

  return gridCoords;
}

// Takes a single calculated point and mirrors it to all 8 octants
function addSymmetry(cx, cy, x, y) {
  gridCoords.add(`${cx + x},${cy + y}`);
  gridCoords.add(`${cx - x},${cy + y}`);
  gridCoords.add(`${cx + x},${cy - y}`);
  gridCoords.add(`${cx - x},${cy - y}`);
  gridCoords.add(`${cx + y},${cy + x}`);
  gridCoords.add(`${cx - y},${cy + x}`);
  gridCoords.add(`${cx + y},${cy - x}`);
  gridCoords.add(`${cx - y},${cy - x}`);
}

// working in a system of grids, not pixels
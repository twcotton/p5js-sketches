const density = " .:-=+*#%@";
const charSize = 12;
let cols, rows;
let time = 0; // Used to animate the math
let gridCoords = new Set();
let griddedMouseX;
let griddedMouseY;
let asciiPixels = [];

function setup() {
  createCanvas(600, 900);
  textFont('monospace');
  textSize(charSize);
  textAlign(CENTER, CENTER);
  frameRate(30)

  cols = floor(width / charSize);
  rows = floor(height / charSize);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = grid2index(x, y, cols)
      asciiPixels[index] = new AsciiPixel(x, y, charSize)
    }
  }
}

function draw() {
  background(10);
  fill(200, 200, 255);

  let griddedMouseX = round(mouseX / width * cols)
  let griddedMouseY = round(mouseY / height * rows)

  drawIndex = grid2index(griddedMouseX, griddedMouseY, cols)
  if (drawIndex < cols * rows) {
    asciiPixels[drawIndex].flicker()
  }

  let gridCoords = calculateCircle(32, 32, 12);

  time += 0.05; // Advance time to animate the waves

  for (pixel of asciiPixels) {
    pixel.update()
    pixel.draw()
  }
}

class AsciiPixel {
  constructor(x, y, size) {
    this.x = x
    this.y = y
    this.size = size

    this.targetChar = " " // when unaffected, setter
    this.char = " " // char to modify in the class

    this.changing = 0;
    this.flickering = false;
    this.flickerIndex = -1;
    this.flickerString = " .:-=+*#%@#%*+=-:. "
  }
  // public
  setChar(char) {
    this.targetChar = char;
  }
  flicker() {
    if (!this.flickering) {
      this.flickerIndex = 0
      this.flickering = true
    }
    // this.startChanging()
  }
  update() {
    if (this.flickering) { this.flickerUpdate() }
  }
  draw() {
    if (char != " ") {
      text(
        this.char,
        // this.flickerIndex,
        this.x * this.size + this.size / 2,
        this.y * this.size + this.size / 2
      )
    }
  }

  // private
  flickerUpdate() {
    if (this.flickerIndex > this.flickerString.length) {
      this.flickerIndex = 0
      this.flickering = false
      // this.stopChanging()

      this.char = this.targetChar
    }

    this.char = this.flickerString.charAt(this.flickerIndex)

    this.flickerIndex++
  }

  startChanging() { this.changing += 1 }

  stopChanging() {
    this.changing -= 1
    if (this.changing < 0) { this.changing = 0 }
  }
}

function grid2index(x, y, cols) { return (y * cols) + x }
function index2grid(index, cols) {
  let remainder = index % cols;
  let ratio = (index - remainder) / cols;
  let grid = {
    x: remainder,
    y: ratio
  }
  return grid;
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

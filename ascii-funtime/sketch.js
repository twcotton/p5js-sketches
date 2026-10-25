const density = " .:-=+*#%@";
const charSize = 12;
let cols, rows;
let time = 0; // Used to animate the math
let gridCoords = [];
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

  // let gridCoords = calculateCircle(griddedMouseX, griddedMouseY, 12);
  // for (let i = 0; i < (gridCoords.length / 2); i++) {
  //   let brushIndex = grid2index(gridCoords[i], gridCoords[i + 1], cols)
  //   if (brushIndex >= 0) {
  //     asciiPixels[brushIndex].flicker()
  //   }
  // }

  asciiPixels[(frameCount * 2) % (cols * rows)].flicker()
  asciiPixels[(frameCount * 2 + 1) % (cols * rows)].flicker()

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

    this.flickerLength = 60; // in frames
    // this.flickerFreq = 5;
    this.flickerSlope = 1; // 1 is a special case linear
    this.flickerFalloff = [];

    this.calcFalloff();
  }
  // public
  setChar(char) {
    this.targetChar = char;
  }
  setFlickerFalloff(
    length,
    slope
  ) {
    this.flickerLength = length;
    this.flickerSlope = slope;
    this.calcFalloff();
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
    // reset i think?
    if (this.flickerIndex > this.flickerString.length) {
        this.flickerIndex = 0
        this.flickering = false
        // this.stopChanging()

        this.char = this.targetChar
    }

    if (frameCount % this.flickerFreq == 1) {
      this.char = this.flickerString.charAt(this.flickerIndex)
      this.flickerIndex++
    }
  }

  calcFalloff() {
    // reset old falloff
    this.flickerFalloff = [];

    let endValue = 0
    let startValue = 1

    for(let i = 0; i < this.flickerLength; i++) {
      t = i / this.flickerLength;
      factor = (1.0 - t) * this.flickerSlope;
      value = endValue + (startValue - endValue) * factor

      this.flickerFalloff[i] = value
    }
  }

  calcFlickerPattern() {
    for(let i = 0; i < this.flickerFalloff.length; i++) {

    }
  }

  startChanging() { this.changing += 1 }

  stopChanging() {
    this.changing -= 1
    if (this.changing < 0) { this.changing = 0 }
  }
}

function grid2index(x, y, cols) {
  if (x > cols) { return -1 }
  if (y > rows) { return -1 }
  return (y * cols) + x
}
function index2grid(index, cols) {
  let remainder = index % cols;
  let ratio = (index - remainder) / cols;
  let grid = {
    x: remainder,
    y: ratio
  }
  if (grid.x > cols) {
    grid.x = -1
    grid.y = -1
    return grid
  }
  if (grid.y > rows) {
    return
  }
  return grid;
}

// Bresenham's Midpoint Circle Algorithm
function calculateCircle(cx, cy, r) {
  let coords = [];

  let x = 0;
  let y = r;

  // The decision parameter determines whether to step diagonally or straight
  let decision = 3 - 2 * r;

  addSymmetry(coords, cx, cy, x, y);

  // Loop until the octant crosses the 45-degree line (when x becomes > y)
  while (y >= x) {
    x++;

    if (decision > 0) {
      y--;
      decision = decision + 4 * (x - y) + 10;
    } else {
      decision = decision + 4 * x + 6;
    }

    addSymmetry(coords, cx, cy, x, y);
  }

  return coords;
}

// Takes a single calculated point and mirrors it to all 8 octants
function addSymmetry(coords, cx, cy, x, y) {
  coords.push(
    cx + x, cy + y,
    cx - x, cy + y,
    cx + x, cy - y,
    cx - x, cy - y,
    cx + y, cy + x,
    cx - y, cy + x,
    cx + y, cy - x,
    cx - y, cy - x
  );
}

// working in a system of grids, not pixels

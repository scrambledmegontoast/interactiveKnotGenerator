let cellSize = 40;
let strandWidth = 10;
let w, h;
let canvas;
let cells = [];

let debug = false;

let strandWidthSlider;
let cellSizeSlider;
let colorDropdown;
let strokeColorDropdown;
let bgColorDropdown;
let bgToggleCheckbox;
let formatDropdown;
let fillC = 255;
let strokeC = '#f7e4c6'
let bgColor = '#bfb9ad';
let bgEnabled = false;
let saveCount = 1;

const R = 1 << 0;
const D = 1 << 1;
const L = 1 << 2;
const U = 1 << 3;

//colors
let limeGreen = '#ddfa3e';
let softBrown = '#f7e4c6';
let softWhite = '#f2efed';
let darkBlack = '#000000';
let softTaupe = '#bfb9ad'; 


function setup() {
  // Create a div for sliders and set its id
  let slidersDiv = select('#slidersDiv');
  
  // Create the strandWidth slider and label
  let strandWidthLabel = createSpan('Strand Width: ');
  strandWidthLabel.parent(slidersDiv);
  strandWidthSlider = createSlider(2, cellSize - 2, cellSize * 4/5, 1);
  strandWidthSlider.parent(slidersDiv);


  // Create the cell size slider and label
  let cellSizeLabel = createSpan('Cell Size: ');
  cellSizeLabel.parent(slidersDiv);
  cellSizeSlider = createSlider(20, 80, cellSize, 1); // Adjust min, max, and initial value as needed
  cellSizeSlider.parent(slidersDiv);
  cellSizeSlider.changed(() => {
    updateGridDimensions();
    clearCells();
  });

  // Create the fill color dropdown and label
  let colorLabel = createSpan('Fill Color: ');
  colorLabel.parent(slidersDiv);
  colorDropdown = createSelect();
  colorDropdown.option('White', softWhite);
  colorDropdown.option('Lime', limeGreen );
  colorDropdown.option('Black', darkBlack);
  colorDropdown.option('Cool Grey', softTaupe);
  colorDropdown.option('Warm Grey', softBrown);
  colorDropdown.option('Transparent', 'transparent');
  colorDropdown.changed(() => fillC = colorDropdown.value());
  colorDropdown.parent(slidersDiv);

  // Create the stroke color dropdown and label
  let strokeColorLabel = createSpan('Stroke Color: ');
  strokeColorLabel.parent(slidersDiv);
  strokeColorDropdown = createSelect();
  strokeColorDropdown = createSelect();
  strokeColorDropdown.option('White', softWhite);
  strokeColorDropdown.option('Lime', limeGreen );
  strokeColorDropdown.option('Black', darkBlack);
  strokeColorDropdown.option('Cool Grey', softTaupe);
  strokeColorDropdown.option('Warm Grey', softBrown);
  strokeColorDropdown.option('Transparent', 'transparent');
  strokeColorDropdown.changed(() => strokeC = strokeColorDropdown.value());
  strokeColorDropdown.parent(slidersDiv);

  // Create the background color dropdown and label
  let bgColorLabel = createSpan('Background Color: ');
  bgColorLabel.parent(slidersDiv);
  bgColorDropdown = createSelect();
  bgColorDropdown.option('White', softWhite);
  bgColorDropdown.option('Lime', limeGreen );
  bgColorDropdown.option('Black', darkBlack);
  bgColorDropdown.option('Cool Grey', softTaupe);
  bgColorDropdown.option('Warm Grey', softBrown);
  bgColorDropdown.changed(() => bgColor = bgColorDropdown.value());
  bgColorDropdown.parent(slidersDiv);

  // Create the background toggle checkbox and label
  let bgToggleLabel = createSpan('Transparent?');
  bgToggleLabel.parent(slidersDiv);
  bgToggleCheckbox = createCheckbox('', true);
  bgToggleCheckbox.changed(() => bgEnabled = bgToggleCheckbox.checked());
  bgToggleCheckbox.parent(slidersDiv);
    // Create the format dropdown and label
    let formatLabel = createSpan('Canvas Format: ');
    formatLabel.parent(slidersDiv);
    formatDropdown = createSelect();
    formatDropdown.option('Square', 'square');
    formatDropdown.option('Portrait', 'portrait');
    formatDropdown.option('Landscape', 'landscape');
    formatDropdown.changed(updateCanvasSize);
    formatDropdown.parent(slidersDiv);

      // Create the Clear button 
  let clearButton = createButton('Clear Canvas');
  clearButton.parent(slidersDiv);
  clearButton.mousePressed(clearCanvas);


    // Create the Save button
    let saveButton = createButton('Export to PNG');
    saveButton.parent(slidersDiv);
    saveButton.mousePressed(saveKnot);
  
 // Initialize canvas with initial size based on default format
 updateCanvasSize();
  
 // Calculate grid dimensions initially
 updateGridDimensions();
 
 // Clear cells array
 clearCells();
}
//grid dimension function
function updateGridDimensions() {
  // This function now adjusts cellSize based on slider
  cellSize = cellSizeSlider.value();
  w = floor(width / cellSize); // Calculate number of columns
  h = floor(height / cellSize); // Calculate number of rows
}

function updateCanvasSize() {
  let canvasWidth = 400;
  let canvasHeight = 400;

  let selectedFormat = formatDropdown.value();
  switch (selectedFormat) {
    case 'portrait':
      canvasHeight = 533;
      break;
    case 'landscape':
      canvasWidth = 533;
      break;
    // Default case is 'square'
  }

  // Store current state of cells
  let currentCells = cells;

  // Create new canvas
  createCanvas(canvasWidth, canvasHeight);

  // Reinitialize cells and redraw based on stored data
  cells = currentCells;
  updateGridDimensions();
  clearCells(); // Optionally clear and redraw cells
}

// Function to clear the canvas and reset data
function clearCanvas() {
  clearCells(); // Clear the cells array or any other relevant data structures
}

// Function to save the canvas as PNG
function saveKnot() {
  saveCanvas(`knot${saveCount}.png`);
  saveCount++; 
}

function draw() {
  // Update strandWidth based on slider value
  strandWidth = strandWidthSlider.value();

  updateGridDimensions();

    // Set the background if enabled
    if (bgEnabled) {
      clear();
    } else {
      background(bgColor);
    }
  
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      const c = cells[i][j];
      if (c.on) {
        const x = (i + 0.5) * cellSize;
        const y = (j + 0.5) * cellSize;
        cell(c.mask, x, y);
      }
    }
  }
  
  noFill();
  stroke(limeGreen);
  const x = mouseCellX() * cellSize;
  const y = mouseCellY() * cellSize;
  rect(x, y, cellSize, cellSize);
}

function keyReleased() {
  debug = !debug;
}

function mouseReleased() {
  let cellX = mouseCellX();
  let cellY = mouseCellY();

  console.log(`Mouse released at (${cellX}, ${cellY})`);
  
  if (cellX >= 0 && cellX < w && cellY >= 0 && cellY < h) {
    let cpx = (mouseX - cellX * cellSize) / cellSize;
    let cpy = (mouseY - cellY * cellSize) / cellSize;

    let dir = -1;
    const margin = 0.2;
    if (cpx < margin) {
      dir = L;
    } else if (cpx > 1 - margin) {
      dir = R;
    } else if (cpy < margin) {
      dir = U;
    } else if (cpy > 1 - margin) {
      dir = D;
    }

    if (dir === -1) {
      invertCell(cellX, cellY);
    } else {
      splitCell(cellX, cellY, dir);
    }
  } else {
    console.error(`Invalid mouse coordinates (${mouseX}, ${mouseY})`);
  }
}

function mouseCellX() {
  return floor(mouseX / cellSize);
}

function mouseCellY() {
  return floor(mouseY / cellSize);
}

function invertCell(x, y) {
  if (x >= 0 && x < w && y >= 0 && y < h) {
    cells[x][y].switch();
    const on = cells[x][y].on;
    if (x - 1 >= 0) cells[x - 1][y].flip(R, on);
    if (x + 1 < w) cells[x + 1][y].flip(L, on);
    if (y - 1 >= 0) cells[x][y - 1].flip(D, on);
    if (y + 1 < h) cells[x][y + 1].flip(U, on);
  } else {
    console.error(`Invalid cell indices (${x}, ${y})`);
  }
}
function splitCell(x, y, bit) {
  // Check if cells[x] and cells[x][y] are defined
  if (cells[x] && cells[x][y]) {
    let hasBit = cells[x][y].hasBit(bit);
    cells[x][y].flip(bit, !hasBit);

    // Handle adjacent cells based on bit direction
    switch (bit) {
      case R:
        if (x + 1 < w && cells[x + 1][y]) {
          cells[x + 1][y].flip(L, !hasBit);
        }
        break;
      case L:
        if (x - 1 >= 0 && cells[x - 1][y]) {
          cells[x - 1][y].flip(R, !hasBit);
        }
        break;
      case D:
        if (y + 1 < h && cells[x][y + 1]) {
          cells[x][y + 1].flip(U, !hasBit);
        }
        break;
      case U:
        if (y - 1 >= 0 && cells[x][y - 1]) {
          cells[x][y - 1].flip(D, !hasBit);
        }
        break;
      default:
        break;
    }
  } else {
    console.error(`Cell at (${x}, ${y}) is undefined.`);
  }
}
class Cell {
  constructor() {
    this.on = false;
    this.mask = 0;
  }
  
  switch() {
    this.on = !this.on;
  }
  
  hasBit(bit) {
    return (this.mask & bit) > 0;
  }
  
  flip(bit, on) {
    if(on) {
      this.mask |= bit;  
    } else {
      this.mask &= ~bit;
    }
  }
}

function clearCells() {
  cells = [];
  for (let i = 0; i < w; i++) {
    let col = [];
    for (let j = 0; j < h; j++) {
      col.push(new Cell());
    }
    cells.push(col);
  }
}

function cell(mask, x, y) {
  if(mask < 0 || mask > 15) {
    return;
  }
  
  const rot = rotations[mask];
  const equiv = equivilent[mask];
  
  push();

  stroke(softTaupe);
  
  translate(x, y);
  rotate(rot * PI/2);
  
  if(debug) {
    noFill();
    rect(-cellSize/2, -cellSize/2, cellSize, cellSize);
  }
  
 
  
// Handle fill color
if (fillC === 'transparent') {
  noFill();
} else {
  fill(fillC);
}
  stroke(strokeC);
  
  const s = strandWidth/2;
  const c = cellSize/2;
  
  switch(equiv) {
    case 0:
      noStroke();
      beginShape();
      vertex(c, s);
      vertex(s, c);
      vertex(-s, c);
      vertex(-c, s);
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      vertex(c-s, 0);
      vertex(0, -c + s);
      vertex(-c + s, 0);
      vertex(0, c-s);
      vertex(c, -s);
      endShape();
      stroke(strokeC);
      noFill();
      
      beginShape();
      vertex(c, s);
      vertex(s, c);
      vertex(-s, c);
      vertex(-c, s);
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      endShape(CLOSE);
      
      beginShape();
      vertex(0, c-s);
      vertex(-c + s, 0);
      vertex(0, -c + s);
      vertex(c-s, 0);
      endShape(CLOSE);
      break;
    case 1:
      noStroke();
      beginShape();
      vertex(c, s);
      vertex(s, c);
      vertex(-s, c);
      vertex(-c, s);
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      vertex(c-s, 0);
      vertex(0, -c + s);
      vertex(-c + s, 0);
      vertex(0, c-s);
      vertex(c, -s);
      endShape();
      
      stroke(strokeC);
      noFill();
      beginShape();
      vertex(c, s);
      vertex(s, c);
      vertex(-s, c);
      vertex(-c, s);
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      vertex(0, c-s);
      vertex(-c + s, 0);
      vertex(0, -c + s);
      vertex(c-s, 0);
      endShape();
      break;
    case 3:
      noStroke();
      beginShape();
      vertex(c, s);
      vertex(s, c);
      vertex(-s, c);
      vertex(-c, s);
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      vertex(c-s, 0);
      vertex(0, -c + s);
      vertex(-c + s, 0);
      vertex(0, c-s);
      vertex(c, -s);
      endShape();
      
      stroke(strokeC);
      noFill();
      beginShape();
      vertex(-s, c);
      vertex(-c, s);
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      vertex(0, c-s);
      vertex(c-s, 0);
      vertex(0, -c + s);
      vertex(-c + s, 0);
      vertex(s, c);
      vertex(c, s);
      endShape();
      break;
    case 5:
      noStroke();
      beginShape();
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      vertex(c-s, 0);
      vertex(0, -c + s);
      vertex(-c, s);
      endShape();
      
      noFill();
      stroke(strokeC);
      beginShape();
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      vertex(c-s, 0);
      vertex(0, -c + s);
      vertex(-c, s);
      endShape();
      
      noStroke();
      fill(fillC);
      beginShape();
      vertex(c, s);
      vertex(s, c);
      vertex(-s, c);
      vertex(-c, s);
      vertex(-c + s, 0);
      vertex(0, c-s);
      vertex(c, -s);
      endShape();
      
      noFill();
      stroke(strokeC);
      beginShape();
      vertex(c, s);
      vertex(s, c);
      vertex(-s, c);
      vertex(-c, s);
      vertex(-c + s, 0);
      vertex(0, c-s);
      vertex(c, -s);
      endShape();      
      break;
    case 7:
      noStroke();
      beginShape();
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      vertex(c-s, 0);
      vertex(0, -c + s);
      vertex(-c, s);
      endShape();
      
      noFill();
      stroke(strokeC);
      beginShape();
      vertex(-c, -s);
      vertex(-s, -c);
      vertex(s, -c);
      vertex(c, -s);
      vertex(c-s, 0);
      vertex(0, -c + s);
      vertex(-c, s);
      endShape();
      
      noStroke();
      fill(fillC);
      beginShape();
      vertex(c, s);
      vertex(s, c);
      vertex(0, c-s);
      vertex(c, -s);
      endShape();
      
      noFill();
      stroke(strokeC);
      beginShape();      
      vertex(c, s);
      vertex(s, c);
      vertex(0, c-s);
      vertex(c, -s);
      endShape();
      
      
      noStroke();
      fill(fillC);
      beginShape();
      vertex(s, c);
      vertex(-c + s, 0);
      vertex(-c, s);
      vertex(-s, c);
      endShape();
      
      noFill();
      stroke(strokeC);
      beginShape();
      vertex(s, c);
      vertex(-c + s, 0);
      vertex(-c, s);
      vertex(-s, c);
      endShape();
      break;
    case 15:
      noStroke();
      beginShape();
      vertex(-s, -c);
      vertex(c - s, 0);
      vertex(c, -s);
      vertex(s, -c);
      endShape();
      stroke(0);
      noFill();
      beginShape();
      vertex(-s, -c);
      vertex(c - s, 0);
      vertex(c, -s);
      vertex(s, -c);
      endShape();
      
      fill(fillC);
      noStroke();
      beginShape();
      vertex(s, c);
      vertex(- c + s, 0);
      vertex(-c, s);
      vertex(-s, c);
      endShape();
      stroke(0);
      noFill();
      beginShape();
      vertex(s, c);
      vertex(- c + s, 0);
      vertex(-c, s);
      vertex(-s, c);
      endShape();
      
      fill(fillC);
      noStroke();
      beginShape();
      vertex(c, -s);
      vertex(0, c - s);
      vertex(s, c);
      vertex(c, s);
      endShape();
      stroke(0);
      noFill();
      beginShape();
      vertex(c, -s);
      vertex(0, c - s);
      vertex(s, c);
      vertex(c, s);
      endShape();
      
      fill(fillC);
      noStroke();
      beginShape();
      vertex(-c, s);
      vertex(0, -c + s);
      vertex(-s, -c);
      vertex(-c, -s);
      endShape();
      stroke(0);
      noFill();
      beginShape();
      vertex(-c, s);
      vertex(0, -c + s);
      vertex(-s, -c);
      vertex(-c, -s);
      endShape();
      break;
  }
  
  pop();
}

const equivilent = {
  0: 0,
  
  1: 1,
  2: 1,
  4: 1,
  8: 1,
  
  3: 3,
  6: 3,
  12:3,
  9: 3,
  
  5: 5,
  10:5,
  
  7: 7,
  14:7,
  13:7,
  11:7,
  
  15: 15,
}

const rotations = {
  0: 0,
  
  1: 0,
  2: 1,
  4: 2,
  8: 3,
  
  3: 0,
  6: 1,
  12:2,
  9: 3,
  
  5: 0,
  10:1,
  
  7: 0,
  14:1,
  13:2,
  11:3,
  
  15:0,
}
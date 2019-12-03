// Import stylesheets
import './style.css';

const PIXI = require('pixi.js');
const TinyQueue = require('tinyqueue');
const seedrandom = require('seedrandom');
const randomInt = require('random-int');

const randomGenerator = seedrandom('hello');

const randInt = function(a, b) {
  return randomInt(a, b);
  // return a + Math.floor((b - a) * randomGenerator());
};

const clamp = function(x, a, b) {
  return Math.min(Math.max(x, a), b);
};

// console.log(clamp(3, 1, 2));

const Rectangle = function(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height,
    size: width * height
  };
};

const getRandomColor = function() {
  var letters = '0123456789ABCDEF';
  var color = '0x';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(randomGenerator() * 16)];
  }
  return color;
};

const splitRectangle = function(parent, child) {
  const grid = [
    Rectangle(parent.x, parent.y, child.x - parent.x, child.y - parent.y),
    Rectangle(parent.x, child.y, child.x - parent.x, child.height),
    Rectangle(parent.x, child.y + child.height, child.x - parent.x, parent.height - (child.y + child.height)),

    Rectangle(child.x, parent.y, child.width, child.y - parent.y),
    // Rectangle(child.x, child.y, child.width, child.height),
    Rectangle(child.x, child.y + child.height, child.width, parent.height - (child.y + child.height)),

    Rectangle(child.x + child.width, parent.y, parent.width - (child.x + child.width), child.y - parent.y),
    Rectangle(child.x + child.width, child.y, parent.width - (child.x + child.width), child.height),
    Rectangle(child.x + child.width, child.y + child.height, parent.width - (child.x + child.width), parent.height - (child.y + child.height))
  ];
  return grid;
};

const setup = function(state) {
  state.width = 640;
  state.height = 480;

  state.renderer = new PIXI.Renderer({ width: state.width, height: state.height, backgroundColor: 0x1099bb });
  document.body.appendChild(state.renderer.view);
  state.stage = new PIXI.Container();
  
  state.colors = [];
  for (let i = 0; i < 9; i++) {
    const rnd = getRandomColor();
    state.colors.push(rnd);
  }  

  return state;
};

const processing = function(state) {
  state.graphics = new PIXI.Graphics();
  state.stage.addChild(state.graphics);

  const before = performance.now();
  
  const startRectangle = Rectangle(0, 0, state.width, state.height);

  const roomWidthMin = 20;
  const roomWidthMax = 150;
  const roomHeightMin = 20;
  const roomHeightMax = 150;

  const roomCount = 2;
  const rooms = [];
  const splitQueue = new TinyQueue([startRectangle], (a, b) => b.size - a.size);
  const addIndex = 0;
  for (let roomIndex = 0; roomIndex < roomCount; roomIndex++) {
    const top = splitQueue.pop();

    const minX = top.x;
    const maxX = top.x + top.width;
    const minY = top.y;
    const maxY = top.y + top.height;
    const x = randInt(minX, maxX);
    const width = randInt(roomWidthMin, clamp(maxX - x, roomWidthMin, roomWidthMax));
    const y = randInt(minY, maxY);
    const height = randInt(roomHeightMin, clamp(maxY - y, roomHeightMin, roomHeightMax));

    console.log("minX", minX, maxX, x, y, width, height);
    const child = Rectangle(x, y, width, height);
    // console.log(child.size);

    state.graphics.beginFill(0xFFFFFF);
    state.graphics.drawRect(child.x, child.y, child.width, child.height);
    state.graphics.endFill();

    const firstSplits = splitRectangle(top, child);
    for (let i = 0; i < firstSplits.length; i++) {
      const rect = firstSplits[i];

      state.graphics.lineStyle(2, 0xFEEB77, 1);
      let color = 0x000000;
      switch (i) {
        case 0:
          color = 0xFF0000;
          break;
        case 1:
          color = 0x800000;
          break;
        case 2:
          color = 0x400000;
          break;
        case 3:
          color = 0x00FF00;
          break;
        case 4:
          color = 0x008000;
          break;
        case 5:
          color = 0x0000FF;
          break;
        case 6:
          color = 0x000080;
          break;
        case 7:
          color = 0x000040;
          break;
      }
      state.graphics.beginFill(color);
      state.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
      state.graphics.endFill();

      rect.addIndex = addIndex;
      addIndex++;

      splitQueue.push(rect);
    }
  }
  const after = performance.now();
  state.elapsed = after - before;

  return state;
};

const stats = function(state) {
  const p = document.createElement(p);
  p.innerHTML = 'time: ' + Math.round(state.elapsed) + 'ms';
  document.body.appendChild(document.createElement('br'));
  document.body.appendChild(p);
  return state;
};

const startRenderLoop = function(state) {
  const renderLoop = function() {
    state.renderer.render(state.stage);
    requestAnimationFrame(renderLoop);
  };
  requestAnimationFrame(renderLoop);
}

let state = {};
state = setup(state);
state = processing(state);
state = stats(state);
state = startRenderLoop(state);
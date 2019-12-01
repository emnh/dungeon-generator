// Import stylesheets
import './style.css';

const PIXI = require('pixi.js');
const TinyQueue = require('tinyqueue');
const seedrandom = require('seedrandom');

const randomGenerator = seedrandom('hello');

const Rectangle = function(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height
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

    Rectangle(parent.x + child.x, parent.y, child.width, child.y - parent.y),
    Rectangle(parent.x + child.x, child.y, child.width, child.height),
    Rectangle(parent.x + child.x, child.y + child.height, child.width, parent.height - (child.y + child.height)),

    Rectangle(parent.x + child.x + child.width, parent.y, parent.width - (child.x + child.width), child.y - parent.y),
    Rectangle(parent.x + child.x + child.width, child.y, parent.width - (child.x + child.width), child.height),
    Rectangle(parent.x + child.x + child.width, child.y + child.height, parent.width - (child.x + child.width), parent.height - (child.y + child.height)),
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
  const before = performance.now();
  
  const rectangles = [Rectangle(0, 0, state.width, state.height)];

  const child = Rectangle(100, 120, 150, 50);

  const graphics = new PIXI.Graphics();
  state.stage.addChild(graphics);

  graphics.beginFill(getRandomColor());
  graphics.drawRect(child.x, child.y, child.width, child.height);
  graphics.endFill();

  const firstSplits = splitRectangle(rectangles[0], child);
  for (let i = 0; i < firstSplits.length; i++) {
    const rect = firstSplits[i];
    graphics.beginFill(state.colors[i]);
    graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
    graphics.endFill();
    rectangles.push(rect);
  }

  const roomCount = 100;
  for (let roomIndex = 0; roomIndex < roomCount; roomIndex++) {

  }

  const after = performance.now();
  const p = document.createElement(p);
  p.innerHTML = 'time: ' + Math.round(after - before) + 'ms';
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
state = startRenderLoop(state);
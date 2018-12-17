const Timer = require('tiny-timer');
const Random = require('./libs/random');
const Constants = require('./libs/constants');
const Algorithm = require('./libs/algorithm');
const Helper = require('./libs/helper');

// INPUT
const options = {
  width: 7,
  height: 25,
  showGrid: true,
  resetHeights: [7, 6],
  genAlgorithm: Algorithm.GEN_ALGORITHMS.group
};

Algorithm.setGenAlgorithm(options.genAlgorithm);

const grid = [];

Algorithm.genStart(options, grid);

console.log('----------');
console.log('starting grid');
Helper.printGrid(grid, options.showGrid);
console.log('----------');

// Timer execution
const interval = 200;
const seconds = options.height;

let timer = new Timer({ interval: interval });
timer.on('tick', tick);
timer.on('statusChanged', status => console.log('Timer Status:', status));
timer.start(seconds * interval);

function tick(timeLeft) {
  console.log('tick | time left', timeLeft);
  if (timeLeft === 0) {
    return;
  }

  Algorithm.genNext(grid);

  Helper.printGrid(grid, options.showGrid);
  console.log('----------');
}

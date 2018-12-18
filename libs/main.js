const Timer = require('tiny-timer');
const Random = require('./random');
const Constants = require('./constants');
const Algorithm = require('./algorithm');
const Helper = require('./helper');

exports.DEFAULT_OPTIONS = {
  seed: 0,
  genAlgorithm: Algorithm.GEN_ALGORITHMS.group,
  genOptions: {
    width: 7,
    height: 25,
    showGrid: true,
    resetHeights: [7, 6]
  },
  time: 5
};

exports.run = function(runOptions) {
  Random.init(runOptions.seed);
  Algorithm.setGenAlgorithm(runOptions.genAlgorithm);
  let options = runOptions.genOptions;

  const grid = [];

  Algorithm.genStart(options, grid);

  console.log('----------');
  console.log('starting grid');
  Helper.printGrid(grid, options.showGrid);
  console.log('----------');

  // Timer execution
  const ms = Math.max(runOptions.time * 1000, 100); // Min tick is 100ms
  const interval = ms / options.height;

  let timer = new Timer({ interval: interval });
  timer.on('tick', tick);
  timer.on('statusChanged', status => console.log('Timer Status:', status));
  timer.start(ms);

  function tick(timeLeft) {
    console.log('tick | time left', timeLeft);
    if (timeLeft === 0) {
      return;
    }

    Algorithm.genNext(grid);

    Helper.printGrid(grid, options.showGrid);
    console.log('----------');
  }
};

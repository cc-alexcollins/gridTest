/**
 * @module Main
 *
 * @description Entry point for grid generation
 */

const Timer = require('tiny-timer');
const Random = require('./random');
const Constants = require('./constants');
const Algorithm = require('./algorithm');
const Helper = require('./helper');

/**
 * @typedef Options
 *
 * @description Customizable options for the grid generator
 *
 * @property {number} seed The number to see the RNG with
 * @property {module:AlgorithmWrapper~GenAlgorithms} genAlgorithm
 * The algorithm to run when generating the paths on the grid
 * @property {module:AlgorithmWrapper~GenOptions} genOptions
 * The options that determine the grid output
 * @property {boolean} showGrid Whether to print out the grid `|`s or not
 * @property {number} time
 * The number of seconds generation should take. This controls the timer.
 */
exports.DEFAULT_OPTIONS = {
  seed: 0,
  genAlgorithm: Algorithm.GEN_ALGORITHMS.group,
  genOptions: {
    width: 7,
    height: 25,
    resetHeights: [7, 6]
  },
  showGrid: true,
  time: 5
};

/**
 * Generates and displays a grid using the specified input
 *
 * @param {module:Main~Options} options The options to use when generating
 */
exports.run = function(options) {
  console.log('Running Generation! | Options:');
  console.log(options);

  Random.init(options.seed);
  Algorithm.setGenAlgorithm(options.genAlgorithm);
  const grid = [];

  Algorithm.genStart(options.genOptions, grid);

  console.log('----------');
  console.log('starting grid');
  Helper.printGrid(grid, options.showGrid);
  console.log('----------');

  // Timer execution
  const ms = Math.max(options.time * 1000, 10); // Min tick is 100ms
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

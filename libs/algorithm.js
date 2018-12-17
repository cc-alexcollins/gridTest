/**
 * @module AlgorithmWrapper
 *
 * @description Contains a wrapper for the various grid generator algorithms
 */

exports.GEN_ALGORITHMS = {
  group: 'group'
};

const GEN_ALGORITHM_MODULES = {
  [exports.GEN_ALGORITHMS.group]: require('./gen-algorithms/group/groupGen')
};

/**
 * @typedef GenOptions
 *
 * @description Contains the properties that can be used to customize grid
 * generation
 *
 * @property {int} width The max width of the grid at all levels
 * @property {int} height The height of the fully-generated grid
 * @property {boolean} showGrid Whether to print out the grid `|`s or not
 * @property {array} resetHeights
 * GroupGen only. The places to reset the node groups to allow the paths to
 * reconnect.
 */
exports.GEN_OPTIONS = {
  width: 7,
  height: 25,
  showGrid: true,
  resetHeights: [7, 6]
};

var currentAlgorithm =
  exports.GEN_ALGORITHMS[Object.keys(exports.GEN_ALGORITHMS)[0]];

exports.setGenAlgorithm = function(algorithm) {
  currentAlgorithm = algorithm;
};

exports.genStart = function(options, grid) {
  return GEN_ALGORITHM_MODULES[currentAlgorithm].start(options, grid);
};

exports.genNext = function(grid) {
  return GEN_ALGORITHM_MODULES[currentAlgorithm].next(grid);
};

/**
 * @module AlgorithmWrapper
 *
 * @description Contains a wrapper for the various grid generator algorithms
 */

// Generation Options

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
 * **GroupGen only.** The places to reset the node groups to allow the paths to
 * reconnect.
 */
exports.GEN_OPTIONS = {
  width: 7,
  height: 25,
  showGrid: true,
  resetHeights: [7, 6]
};

/**
 * @constant GenAlgorithms
 *
 * @description All of the available algorithms for grid generation
 *
 * @property {module:GroupGen} group Group generation algorithm
 */
exports.GEN_ALGORITHMS = {
  group: 'group'
};

const GEN_ALGORITHM_MODULES = {
  [exports.GEN_ALGORITHMS.group]: require('./gen-algorithms/group/groupGen')
};

// Algorithm Execution

// Default is the first element in `GEN_ALGORITHMS`
var currentAlgorithm =
  exports.GEN_ALGORITHMS[Object.keys(exports.GEN_ALGORITHMS)[0]];

/**
 * Sets the grid generation algorithm
 *
 * @param {module:AlgorithmWrapper~GenAlgorithms} algorithm
 * The algorithm to use for generation
 */
exports.setGenAlgorithm = function(algorithm) {
  currentAlgorithm = algorithm;

  if (!GEN_ALGORITHM_MODULES[currentAlgorithm]) {
    console.error('Invalid generation algorithm specified!', algorithm);
  }
};

/**
 * Starts grid generation by setting up the base set of levels based on the
 * current algorithm
 *
 * @param {module:AlgorithmWrapper~GenOptions} options
 * The options to use during generation
 * @param {module:CoreGen~Level[]} grid The grid object to generate into
 */
exports.genStart = function(options, grid) {
  GEN_ALGORITHM_MODULES[currentAlgorithm].start(options, grid);
};

/**
 * Generates the next level of the grid using the current generation algorithm
 *
 * @param {module:CoreGen~Level[]} grid The grid object to generate into
 */
exports.genNext = function(grid) {
  GEN_ALGORITHM_MODULES[currentAlgorithm].next(grid);
};

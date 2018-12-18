/**
 * @module Random
 *
 * @description Helper class for generating random numbers
 */

const Constants = require('./constants');

/**
 * Initializes the random number generator with the specified seed
 *
 * @param {number} seed The number to seed the RNG with
 */
function init(seed) {
  Constants.rand = require('seedrandom')(seed);
}

/**
 * Gets a random number between `min` (inclusive) and `max` (inclusive)
 *
 * @param {number} min The smallest possible number to generate
 * @param {number} max The largest possible number to generate
 *
 * @returns {number} The randomly generated number
 */
function getRandomInt(min, max) {
  if (min > max) min = max;
  return min + Math.floor(Constants.rand() * (max - min + 1));
}

/**
 * Gets a random element in the array. All elements have an equal chance of
 * being picked.
 *
 * @param {array} array The array to get elements from
 *
 * @returns {any} The element in the array that was selected. If the array is
 * empty, returns `undefined`.
 */
function getRandomElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

exports.init = init;
exports.getRandomInt = getRandomInt;
exports.getRandomElement = getRandomElement;

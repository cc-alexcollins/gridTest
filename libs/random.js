/**
 * @module Random
 *
 * @description Helper class for generating random numbers
 */

/**
 * @constant randSeed
 *
 * @description The seed used for all random number generation
 * @see [Constants.randSeed](#module_Constants..randSeed)
 */
const randSeed = require('./constants').randSeed;
const rand = require('seedrandom')(randSeed);

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
  return min + Math.floor(rand() * (max - min + 1));
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

exports.getRandomInt = getRandomInt;
exports.getRandomElement = getRandomElement;

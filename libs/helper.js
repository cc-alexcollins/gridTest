/**
 * @module Helper
 *
 * @description Contains printing and other helper methods
 */

/**
 * Generates a comma-separated string with all the array elements in the
 * specified group. Used to keep track of duplicate arrays during an
 * operation as the result of this can be considered a unique key.
 *
 * @param {array} array The list of elements to create combine into a string
 *
 * @returns {string} The elements in the array as a comma-separated string
 */
function strJoin(array) {
  if (array.length === 0) return '';
  let first = '' + array[0];
  return array.slice(1).reduce((str, element) => {
    return ',' + str + element;
  }, first);
}

/**
 * Prints all of the nodes of all a series of levels to form a grid structure
 *
 * @param {any} gridToPrint An array of levels to print
 * @param {boolean} printGrid Whether the gridlines should be printed
 * @param {int} visibleRows How many rows will show up in the console
 */
function printGrid(gridToPrint, printGrid, visibleRows) {
  for (
    let i = gridToPrint.length - 1;
    i >= Math.max(0, gridToPrint.length - (visibleRows || 100));
    i--
  ) {
    let level = gridToPrint[i];

    // Print connections
    if (gridToPrint[i + 1]) {
      let connString = '';
      level.nodes.forEach(node => {
        if (!node) {
          connString += '      ';
          return;
        }

        connString += ' ';
        if (node.next.includes(-1)) {
          connString += '\\';
        } else {
          connString += ' ';
        }

        connString += ' ';
        if (node.next.includes(0)) {
          connString += '|';
        } else {
          connString += ' ';
        }

        connString += ' ';
        if (node.next.includes(1)) {
          connString += '/';
        } else {
          connString += ' ';
        }
      });

      console.log(connString);
    }

    // Print this level
    let levelString = '';
    level.nodes.forEach(node => {
      levelString += printGrid ? '| ' : '  ';
      if (node) {
        levelString += nodeText(node.groupId, node.element);
      } else {
        levelString += printGrid ? ' - ' : '   ';
      }
      levelString += ' ';
    });
    levelString += printGrid ? '|' : ' ';
    levelString += ' ' + level.level;
    if (level.special !== '') {
      levelString += ' | ' + level.special;
    }
    console.log(levelString);
  }
}

/**
 * Gets a string representation of a node. The format is:
 * `"{group}-{element}"`
 *
 * @param {number} group The group the node is in
 * @param {string} element The name of the element
 *
 * @returns {string} The node's string representation.
 */
function nodeText(group, element) {
  return '' + group + '-' + element;
}

/**
 * Takes in an array and returns an array of arrays which represents all
 * possible permutations of the input array's elements, including the input.
 *
 * This means that input of [0, 1] becomes:
```
[
  [0], [1], [0, 1]
]
```
 *
 * @param {int[]} connections The base array to expand
 * @param {string[]} foundPermutations Duplicate protection
 *
 * @returns {Array.<int[]>} The permutations of the input array
 */
function arrayPermutations(array, foundPermutations) {
  if (array.length === 0) {
    return [];
  }

  if (foundPermutations.includes(strJoin(array))) {
    return [];
  }
  foundPermutations.push(strJoin(array));

  let arrayCopy = [].concat(array);
  let permutations = [arrayCopy];
  for (let i = 0; i < array.length; i++) {
    let spliced = array.splice(i, 1)[0];
    let elementPermutations = arrayPermutations(array, foundPermutations);
    if (elementPermutations.length > 0) {
      permutations = permutations.concat(elementPermutations);
    }
    array.splice(i, 0, spliced);
  }

  return permutations;
}

exports.strJoin = strJoin;
exports.printGrid = printGrid;
exports.arrayPermutations = arrayPermutations;

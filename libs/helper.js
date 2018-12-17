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
 */
function printGrid(gridToPrint, printGrid) {
  for (let i = gridToPrint.length - 1; i >= 0; i--) {
    let level = gridToPrint[i];

    // Print connections
    if (gridToPrint[i + 1]) {
      let connString = '';
      level.forEach(node => {
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
    for (let i = 0; i < level.length; i++) {
      let node = level[i];
      levelString += printGrid ? '| ' : '  ';
      if (node) {
        levelString += nodeText(node.group, node.element);
      } else {
        levelString += printGrid ? ' - ' : '   ';
      }
      levelString += ' ';
    }
    levelString += printGrid ? '|' : ' ';
    levelString += ' ' + i;
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

exports.strJoin = strJoin;
exports.printGrid = printGrid;

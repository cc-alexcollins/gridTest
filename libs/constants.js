/**
 * @module Constants
 *
 * @description Generation constant values
 */

const Helper = require('./helper');

/**
 * @ignore
 * The random number generator for grid generation. Do not use this to get
 * random numbers, use [Random](#module_Random) instead.
 *
 * @returns {int} A random number
 */
exports.rand = () => 0.5;

/**
 * @constant minNodeGroups
 *
 * @description The minimum number of groups a given level can have
 *
 * @returns {int} The number of groups
 */
exports.minNodeGroups = 1;

/**
 * @constant maxNodeGroups
 *
 * @description The maximum number of groups a given level can have
 *
 * @returns {int} The number of groups
 */
exports.maxNodeGroups = 3;

/**
 * @constant minNodesPerGroup
 *
 * @description The minimum number of nodes a given group can have
 *
 * @returns {int} The number of nodes in a group
 */
exports.minNodesPerGroup = 1;

/**
 * @constant maxNodesPerGroup
 *
 * @description The maximum number of nodes a given group can have
 *
 * @returns {int} The number of nodes in a group
 */
exports.maxNodesPerGroup = 4;

/**
 * @constant maxNodesPerLevel
 *
 * @description
 * The maximum number of nodes a single level can have across all groups
 *
 * @returns {int} The number of nodes for a level
 */
exports.maxNodesPerLevel = 6;

/**
 * @constant minStartingNodes
 *
 * @description The minimum number of nodes to start the grid with. Only applies
 * to the first level.
 *
 * @returns {int} The number of nodes
 */
exports.minStartingNodes = 3;

/**
 * @constant maxStartingNodes
 *
 * @description The maximum number of nodes to start the grid with. Only applies
 * to the first level.
 *
 * @returns {int} The number of nodes
 */
exports.maxStartingNodes = 5;

const allowedGroups = [
  [3, 2],
  [3, 1],
  [3, 0],
  [3, 2, 1],
  [3, 1, 1],
  [2],
  [2, 2],
  [2, 1],
  [2, 2, 1],
  [2, 1, 1],
  [1],
  [1, 1],
  [1, 1, 1]
];

const foundVariations = [];

/**
 * @constant allowedGroupVariations
 *
 * @description All of the legal group variation permutations
 *
 * @returns {Array.<int[]>}
 * The group variations, with each variation being an array of integers indexed
 * by group, and the integer being the count in that group
 */
exports.allowedGroupVariations = allowedGroups.reduce((allGroups, group) => {
  addGroups(allGroups, group, []);
  return allGroups;
}, []);

/**
 * @constant elements
 *
 * @description The name of the node within a given level. Used for printing.
 *
 * @returns {string[]} The name of the node for printing
 */
exports.elements = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function addGroups(allGroups, group, start) {
  if (group.length === 1) {
    const group1 = start.concat(group);
    if (!foundVariations.includes(Helper.strJoin(group1))) {
      foundVariations.push(Helper.strJoin(group1));
      allGroups.push(group1);
    }
  } else {
    for (let x = 0; x < group.length; x++) {
      let swap = group[0];
      group[0] = group[x];
      group[x] = swap;

      start.push(group.shift());
      addGroups(allGroups, group, start);

      group.unshift(start.pop());
      group[x] = group[0];
      group[0] = swap;
    }
  }
}

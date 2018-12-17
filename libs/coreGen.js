/**
 * @module CoreGen
 *
 * @description Core generation methods and objects
 */

/**
 * @typedef Node
 *
 * @description A single cell in a grid of nodes.
 *
 * @property {number} x The x coordinate of the node
 * @property {number} y The y coordinate of the node
 * @property {string} element The identifier for the node within a level
 * @property {number} group
 * The group identifier for the node relative to the previous level
 * @property {array} next
 * The branches that this node provides to the next level of nodes
 * `-1` means up and left, `0` means straight up, and `1` means up and right
 */
const Node = {
  x: 0,
  y: 0,
  element: 'A',
  group: 0,
  next: [-1, 0, 1]
};

/**
 * @typedef Level
 *
 * @description An single row in a grid of nodes. Cells without nodes are
 * marked as `null`.
 */
const Level = {
  level: 0,
  special: '',
  nodes: []
};

/**
 * Creates an empty level (row) for the grid. Each index represents an
 * x-coordinate for the nodes.
 *
 * @param {number} width How many nodes can fit in the level
 *
 * @returns {module:CoreGen~Level} A new level with every element set to `null`
 */
function createLevel(width, y) {
  let nodes = [];
  for (let i = 0; i < width; i++) {
    nodes.push(null);
  }
  return {
    level: y,
    special: '',
    nodes: nodes
  };
}

/**
 * Creates a new node in the grid
 *
 * @param {number} x The x coordinate of the node
 * @param {number} y The y coordinate of the node
 * @param {string} element The identifier for the node within a level
 * @param {number} group
 * The group identifier for the node relative to the previous level
 *
 * @returns {module:CoreGen~Node} A new node
 */
function createNode(x, y, element, group = -1) {
  return {
    x: x,
    y: y,
    element: element,
    group: -1,
    next: []
  };
}

exports.createLevel = createLevel;
exports.createNode = createNode;

/**
 * @module GroupGen
 *
 * @description Group-based node generation
 */

const CoreGen = require('../../coreGen');
const Constants = require('../../constants');
const Random = require('../../random');
const Helper = require('../../helper');

// Constants -- overriden in `start`
var width = 7;
var height = 25;
var resetHeights = [7, 6];

var y = 0;

// Algorithm Methods

/**
 * Starts generation for a grid of nodes.
 *
 * Creates the first level randomly, then assigns random groups based on the
 * positions of the nodes in the level.
 *
 * @param {module:AlgorithmWrapper~GenOptions} options
 * The width, height, and other options to use when generating the grid
 * @param {module:CoreGen~Level[]} grid The grid object to generate into
 */
exports.start = function(options, grid) {
  width = options.width;
  height = options.height;
  resetHeights = options.resetHeights;

  // Generate starting nodes
  const startingNodes = Random.getRandomInt(
    Constants.minStartingNodes,
    Constants.maxStartingNodes
  );

  let startX = Random.getRandomInt(0, 2);
  y = 0;

  let startLevel = CoreGen.createLevel(width, y);
  for (let i = 0; i < startingNodes && startX < width; i++) {
    let node = CoreGen.createNode(startX, y, Constants.elements[i]);
    startLevel.nodes[node.x] = node;

    startX += Random.getRandomInt(1, 2);
  }

  // Generate starting groups
  generateGroups(startLevel);
  grid.push(startLevel);
};

/**
 * Generates the next level for a grid of nodes.
 *
 * Basic algorithm
 * 1. Gather the nodes from the previous level by their group
 * 2. Calculate how many nodes each group should get on the next level
 *     - Takes into account the positions of groups
 * 3. For each group, add the new nodes calculated in the last step
 * 4. Connect each node in the previous level to the nodes in new level,
 * as long as they are in the same group
 * 5. At specified breakpoints, reset the groups to cause paths to merge
 *
 * @param {module:CoreGen~Level[]} grid The grid object to generate into
 */
exports.next = function(grid) {
  y++;
  grid.push(CoreGen.createLevel(width, y));

  generateNodesOnGrid(grid);
};

// Grouping Methods

/**
 * Calculates and assigns groups for the nodes in the specified level
 *
 * @param {CoreGen~Level} level The level to assign groups to
 */
function generateGroups(level) {
  console.log('generating groups for level: ');
  console.log(level.nodes);

  let possibleGroups = Constants.allowedGroupVariations.reduce(
    (groups, check) => {
      if (nodesFitInGrouping(check, level.nodes)) {
        groups.push(check);
      }
      return groups;
    },
    []
  );

  if (possibleGroups.length === 0) {
    console.error('no groups!');
    possibleGroups = [Constants.allowedGroupVariations[0]];
  }

  console.log('possible groups');
  console.log(possibleGroups);
  let group = Random.getRandomElement(possibleGroups);

  // Run this one more time to lock in the group ids
  nodesFitInGrouping(group, level.nodes);

  console.log('selected group', group);
  console.log(level.nodes);
}

/**
 * Checks if the specified nodes fit in a grouping
 *
 * @param {int[]} group A grouping definition -- see
 * {module:Constants~allowedGroupVariations}
 * @param {type} levelNodes The nodes to try and fit in the grouping
 *
 * @returns {boolean} Whether the nodes fit or not
 */
function nodesFitInGrouping(group, levelNodes) {
  let x = 0;
  let fits = true;
  let groupId = 0;
  for (let i = 0; i < group.length; i++) {
    let inGroup = group[i];
    let found = 0;
    fits = false;

    let maxSeparation = maxGroupSeparation(inGroup);
    for (let j = 0; j < maxSeparation && x < width; j++) {
      let node = levelNodes[x++];
      if (node) {
        node.groupId = groupId + 1;
        node.element = Constants.elements[found];
        found++;
        if (found === inGroup) {
          fits = true;
          break; // Start checking the next group immediately
        }
      } else if (found === 0) {
        // Ignore empty nodes until we find the first one
        j--;
      }
    }

    groupId++;

    // If it already doesn't fit the grouping, just break out now
    if (!fits) {
      break;
    }
  }

  // Make sure that every node in the level was accounted for by the grouping.
  // If there are still nodes left unchecked from the loop above, then the
  // current nodes being checked *do not* fit the grouping.
  while (fits && x < width) {
    let node = levelNodes[x++]; // Should be null from x --> width
    if (node) {
      fits = false;
    }
  }

  return fits;
}

function maxGroupSeparation(inGroup) {
  return inGroup + 1;
}

// Generation Methods

/**
 * @typedef Group
 *
 * @description A group for nodes at a given level to fit into
 *
 * @property {int} groupId The id of the group
 * @property {module:CoreGen~Node[]} prevNodes
 * The nodes for this group in the previous level of the grid
 * @property {int} minAdded
 * The minimum number of nodes that are needed in this group so that all nodes
 * from the previous level of the group can have at least 1 connection
 * @property {int} count The maximum number of nodes this group will try to have
 */
const GROUP = {
  groupId: 0,
  prevNodes: [],
  minAdded: 0,
  count: 0 // Calculated below
};

/**
 * Performs the node generation for the next level
 *
 * @param {module:CoreGen~Level[]} grid The grid object to generate into
 */
function generateNodesOnGrid(grid) {
  let currLevel = grid[y];
  let prevLevel = grid[y - 1];

  // Gather the groups
  let groups = [];
  for (let i = 0; i < Constants.maxNodeGroups; i++) {
    let groupId = i + 1;
    let groupNodes = prevLevel.nodes.reduce((gn, node) => {
      if (node && node.groupId === groupId) {
        gn.push(node);
      }
      return gn;
    }, []);

    if (groupNodes.length > 0) {
      let separation = groupNodes[groupNodes.length - 1].x - groupNodes[0].x;
      groups.push({
        groupId: groupId,
        prevNodes: groupNodes,
        minAdded: Math.max(separation - 1, 1),
        count: 0 // Calculated below
      });
    }
  }

  // For each group, estimate how many nodes it will have.
  // This must be done separately from finding the groups because we need to
  // know how many groups we have and their minimum size before we can
  // distribute nodes for the next level.
  let total = groups.reduce((minTotal, group) => {
    minTotal += group.minAdded;
    return minTotal;
  }, 0);

  // Add to total to eliminate unreachable space on the left and right
  let leftSpace =
    Math.min.apply(null, prevLevel.nodes.map(n => (n ? n.x : width))) - 1;
  if (leftSpace > 0) {
    total += leftSpace;
  }
  let rightSpace =
    width - Math.max.apply(null, prevLevel.nodes.map(n => (n ? n.x : -1))) - 2;
  if (rightSpace > 0) {
    total += rightSpace;
  }

  console.log('pre add total', total);

  // This step is done before generating new nodes to ensure we leave
  // space for all groups once we start generating the earlier groups' nodes.
  for (let i = 0; i < groups.length; i++) {
    // Estimate how many new nodes for the group
    let group = groups[i];
    let numNodes = group.prevNodes.length + Random.getRandomInt(-1, 2);
    if (numNodes < group.minAdded) {
      numNodes = group.minAdded;
    }

    if (numNodes < Constants.minNodesPerGroup) {
      numNodes = Constants.minNodesPerGroup;
    } else if (numNodes > Constants.maxNodesPerGroup) {
      numNodes = Constants.maxNodesPerGroup;
    }

    let maxX = Math.max.apply(null, group.prevNodes.map(n => n.x));
    while (
      total + numNodes - group.minAdded > Constants.maxNodesPerLevel ||
      numNodes > width - maxX + 1
    ) {
      numNodes--;
    }

    group.count = numNodes;

    // minAdded was included before the loop, so don't add it again
    total += numNodes - group.minAdded;
  }

  // Take back out the space that was added earlier
  total -= Math.max(leftSpace, 0);
  total -= Math.max(rightSpace, 0);
  console.log('groups determined | adding', total);
  console.log(
    groups.map(g => {
      return {
        groupId: g.groupId,
        min: g.minAdded,
        max: g.count
      };
    })
  );

  // Now that we have all the groups and their min and max node counts, we
  // can start generating nodes for the next level
  groups.forEach(groupInfo => {
    let groupNodeCount = groupInfo.count;
    total -= groupNodeCount;
    addNodesForGroupToLevel(groupInfo, currLevel, total);
  });

  // Reset groups if necessary
  if (resetHeights.length > 0) {
    resetHeights[0]--;
    if (resetHeights[0] === 0) {
      resetHeights.shift();
      generateGroups(currLevel);
      currLevel.special = 'reset';
    }
  }
}

/**
 * Creates and adds nodes for the specified group to the specified level
 *
 * @param {module:GroupGen~Group} group The group to generate nodes for
 * @param {module:CoreGen~Level} currLevel The level to add the nodes to
 * @param {int} nodesLeft
 * How much space needs to be left for the remaining groups that are yet to be
 * generated. Clamps the max node spread for the group.
 */
function addNodesForGroupToLevel(group, currLevel, nodesLeft) {
  const skipWeight = [1, 1, 1, 1, 2];
  console.log('----------');

  let prevNodes = group.prevNodes;
  let minNodes = group.minAdded;
  let maxNodes = group.count;
  let groupId = prevNodes[0].groupId;

  console.log(
    'add nodes',
    groupId,
    '| min:',
    minNodes,
    'max:',
    maxNodes,
    'left:',
    nodesLeft
  );

  let addedNodes = [];
  for (let i = 0; i < maxNodes; i++) {
    let prevX = Math.max.apply(null, currLevel.nodes.map(n => (n ? n.x : -1)));
    let xMin = Math.max(
      0,
      prevX + Random.getRandomElement(skipWeight),
      Math.min.apply(null, prevNodes.map(n => n.x)) - 1
    );
    let furthestPrevNode = prevNodes[Math.min(i, prevNodes.length - 1)].x;
    let xMax = Math.min(width - nodesLeft - 1, furthestPrevNode + 1);

    // Clamp xMax based on the separation of nodes in this level
    if (addedNodes.length > 0) {
      // The -1 accounts for the first node's placement
      let maxSeparationX = addedNodes[0].x + maxGroupSeparation(maxNodes) - 1;
      xMax = Math.min(xMax, maxSeparationX);
    }

    // If there's only one node left, we need extra logic to ensure that
    // all prev nodes can reach at least one node
    if (maxNodes - i === 1) {
      xMin = Math.max(xMin, Math.max.apply(null, prevNodes.map(n => n.x)) - 1);
    }

    // We're at the edge -- can't add more nodes to add
    if (xMin > xMax) {
      if (addedNodes.length < minNodes) {
        xMin = xMax;
      } else {
        console.log('break early', xMin, xMax, addedNodes.length);
        break;
      }
    }

    // Lean left --> (min, max) of (1, 3) becomes (1, 1, 1, 2, 2, 3)
    const leanStrength = [0, 0, 0, 1];
    let leftLeaning = [];
    for (let val = xMin; val <= xMax; val++) {
      let delta = Math.max(
        0,
        xMax - val - Random.getRandomElement(leanStrength)
      );
      for (let j = 0; j < delta + 1; j++) {
        leftLeaning.push(val);
      }
    }

    let x = Random.getRandomElement(leftLeaning);
    console.log(xMin, xMax, leftLeaning, '-->', x);

    let node = CoreGen.createNode(x, y, Constants.elements[i]);
    node.groupId = groupId;
    currLevel.nodes[node.x] = node;
    addedNodes.push(node);
  }
  console.log(addedNodes);

  // Connect the new nodes and the old nodes
  let possibleConnections = getAllConnections(prevNodes, addedNodes);

  console.log('possible connections');
  console.log(possibleConnections);
  let connections = Random.getRandomElement(possibleConnections);
  // No need to validate -- just do the set
  validateNodeConnections(connections, prevNodes, null);
}

/**
 * Calculates all the various ways that the nodes in `prevNodes` can be
 * connected to the nodes in `addedNodes`.
 *
 * From inner to outer, the result contains these values:
 * * The integers are connections between two nodes
 * * The integer arrays are the connections for a given node
 * * The array of integer arrays is the connections for all the nodes in a set
 * * The array that holds that is all of the permutations of connection sets
 *
 * It ends up looking like this:
```
[ // all connections
 [ // node-connection arrays
   [0, 1], // node index 0 connects to straight and right
   [-1, 0] // node index 1 connects to left and straight
 ],
 [
   [0], // node index 0 connects to straight ahead
   [1]  // node index 1 connects to the right
 ],
 [
   // ... more connections
 ]
]
```
 *
 * @param {type} prevNodes  Description
 * @param {type} addedNodes Description
 *
 * @returns {Array.< Array.< Array.< int > > >}
 * A 3-deep array -- array of array of integer arrays
 */
function getAllConnections(prevNodes, addedNodes) {
  /*
  // This first step converts all nodes into an array of their
  // possible connections to other nodes
  [ // all nodes
    [ // prev node 0
      // possible connections for node 0
      [0], [0, 1], [1]
    ],
    [ // prev node 1
      // possible connections for node 1
      [-1]
    ]
  ]
   */

  let connections = [];
  // Get all connection possibilities for each node
  for (let i = 0; i < prevNodes.length; i++) {
    let node = prevNodes[i];
    let nodeConnections = addedNodes.reduce((conns, addedNode) => {
      let delta = addedNode.x - node.x;
      if (-1 <= delta && delta <= 1) {
        conns.push(delta);
      }
      return conns;
    }, []);

    console.log('node connections | node', i);
    console.log(nodeConnections);

    connections.push(Helper.arrayPermutations(nodeConnections, []));
  }

  // Trim connection possibilities by validating all permutations and
  // removing ones that fail
  console.log('all node connectivity');
  console.log(connections);

  let connectionPossibilities = validateConnections(
    connections,
    [], // starting set
    prevNodes,
    addedNodes,
    [] // duplicate protection
  );

  return connectionPossibilities;
}

/**
 * Returns the subset of node connectivity that properly connect all nodes
 * in the `fromNodes` set to those in the `toNodes` set.
 *
 * The input is an array of node connections. The output is an array of
 * connectivity possibilities.
 *
 * @param {Array.< Array.< Array.< int > > >} connections
 * All of the possible connections for each node in `toNodes`
 * @param {Array.< int >} set
 * The current set of connections that is being checked
 * @param {module:CoreGen~Node[]} fromNodes
 * The nodes being connected. Each of these *must* connect to at least one
 * node in the `toNodes`.
 * @param {module:CoreGen~Node[]} toNodes The nodes being connected to
 * @param {string[]} validated The connectivity sets that have already been
 * validated, used for duplicate protection
 *
 * @returns {Array.< Array.< Array.< int > > >}
 * The node connectivity arrays that correctly connect all of the nodes
 */
function validateConnections(connections, set, fromNodes, toNodes, validated) {
  if (validated.includes(Helper.strJoin(set))) {
    return;
  }
  validated.push(Helper.strJoin(set));

  let validatedConnections = [];
  if (set.length === connections.length) {
    // set is a valid node combo, so validate it
    let valid = validateNodeConnections(set, fromNodes, toNodes);
    if (valid) {
      return [set];
    }
  } else {
    let atNodeIndex = set.length;
    let nodePossibleConnections = connections[atNodeIndex];
    for (let i = 0; i < nodePossibleConnections.length; i++) {
      let nodeSet = [].concat(set);
      nodeSet.push(nodePossibleConnections[i]);
      let validConnections = validateConnections(
        connections,
        nodeSet,
        fromNodes,
        toNodes,
        validated
      );
      validatedConnections = validatedConnections.concat(validConnections);
    }
  }

  return validatedConnections;
}

/**
 * Sets the `next` connections for each of the `fromNodes`, then validates
 * that those connections work to connect them to the `toNodes`.
 *
 * Also performs additional validation based on fixed rules.
 *
 * @param {Array.<int[]>} connections
 * The connections for each of the `fromNodes`
 * @param {module:CoreGen~Node[]} fromNodes The nodes being connected from
 * @param {module:CoreGen~Node[]} toNodes
 * The nodes being connected to. If `null`, just sets the `fromNode` connections
 * and returns `true`.
 *
 * @returns {boolean} `true` if the connections match up, `false` otherwise
 */
function validateNodeConnections(connections, fromNodes, toNodes) {
  // Set the connections
  for (let i = 0; i < fromNodes.length; i++) {
    let fromNode = fromNodes[i];
    let nodeConnections = connections[i];
    fromNode.next = nodeConnections;
  }

  // Validate the connections
  if (toNodes) {
    // 1. Verify every to node has a connection
    let notFound = [].concat(toNodes);
    fromNodes.forEach(node => {
      node.next.forEach(dir => {
        let index = notFound.findIndex(n => {
          return n.x === node.x + dir;
        });
        if (index >= 0) {
          notFound.splice(index, 1);
        }
      });
    });

    if (notFound.length > 0) {
      console.log('validate | fail | incomplete connectivity |', connections);
      return false;
    }

    // 2. Don't cross the streams
    for (let i = 0; i < fromNodes.length - 1; i++) {
      let first = fromNodes[i];
      let second = fromNodes[i + 1];
      if (
        first.x + 1 === second.x &&
        first.next.includes(1) &&
        second.next.includes(-1)
      ) {
        console.log('validate | fail | crossing streams |', connections);
        return false;
      }
    }

    console.log('validate | success |', connections);
  } else {
    console.log('assign |', connections);
  }

  return true;
}

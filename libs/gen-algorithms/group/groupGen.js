/** @module GroupGen */

const CoreGen = require('../../coreGen');
const Constants = require('../../constants');
const Random = require('../../random');
const Helper = require('../../helper');

// Constants
var width = 7;
var height = 25;
var resetHeights = [7, 6];

var y = 0;

// Algorithm Methods

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

  let startLevel = CoreGen.createLevel(width);
  for (let i = 0; i < startingNodes && startX < width; i++) {
    let node = CoreGen.createNode(startX, y, Constants.elements[i]);
    startLevel[node.x] = node;

    startX += Random.getRandomInt(1, 2);
  }

  // Generate starting groups
  generateGroups(startLevel);
  grid.push(startLevel);
};

exports.next = function(grid) {
  grid.push(CoreGen.createLevel(width));
  y = grid.length - 1;

  generateNodesOnGrid(grid);
};

function generateNodesOnGrid(grid) {
  let currLevel = grid[y];
  let prevLevel = grid[y - 1];

  // Gather the groups
  let groups = [];
  for (let i = 0; i < Constants.maxNodeGroups; i++) {
    let groupId = i + 1;
    let groupNodes = prevLevel.reduce((gn, node) => {
      if (node && node.group === groupId) {
        gn.push(node);
      }
      return gn;
    }, []);

    if (groupNodes.length > 0) {
      let separation = groupNodes[groupNodes.length - 1].x - groupNodes[0].x;
      groups.push({
        group: groupId,
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

  // Now that we have all the groups and their min and max node counts, we
  // can start generating nodes for the next level
  groups.forEach(groupInfo => {
    let groupNodeCount = groupInfo.count;
    total -= groupNodeCount;
    addGroupNodesFromNodes(currLevel, groupInfo, total);
  });

  // Reset groups if necessary
  if (resetHeights.length > 0) {
    resetHeights[0]--;
    if (resetHeights[0] === 0) {
      resetHeights.shift();
      generateGroups(currLevel);
    }
  }
}

// Generation Methods

function generateGroups(level) {
  console.log('generating groups for level: ');
  console.log(level);

  let possibleGroups = Constants.allowedGroupVariations.reduce(
    (groups, check) => {
      if (nodesFitInGrouping(check, level)) {
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
  nodesFitInGrouping(group, level);

  console.log('selected group', group);
  console.log(level);
}

function nodesFitInGrouping(group, level) {
  let x = 0;
  let fits = true;
  let groupId = 0;
  for (let i = 0; i < group.length; i++) {
    let inGroup = group[i];
    let found = 0;
    fits = false;

    let maxGroupSeperation = inGroup + 1;
    for (let j = 0; j < maxGroupSeperation && x < width; j++) {
      let node = level[x++];
      // console.log(group, i, groupId, '|', node ? node.element : ' ', j, found);
      if (node) {
        node.group = groupId + 1;
        node.element = Constants.elements[found];
        found++;
        if (found === inGroup) {
          fits = true;
          break;
        }
      } else if (found === 0) {
        // Ignore empty nodes until we find the first one
        j--;
      }
    }

    groupId++;

    if (!fits) {
      break;
    }
  }

  while (fits && x < width) {
    let node = level[x++];
    if (node) {
      fits = false;
    }
  }

  return fits;
}

function addGroupNodesFromNodes(currLevel, group, nodesLeft) {
  const skipWeight = [1, 1, 1, 1, 2];
  console.log('----------');

  let prevNodes = group.prevNodes;
  let minNodes = group.minAdded;
  let maxNodes = group.count;
  let groupId = prevNodes[0].group;

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
    let prevX = Math.max.apply(null, currLevel.map(n => (n ? n.x : -1)));
    let xMin = Math.max(
      0,
      prevX + Random.getRandomElement(skipWeight),
      Math.min.apply(null, prevNodes.map(n => n.x)) - 1
    );
    let furthestPrevNode = prevNodes[Math.min(i, prevNodes.length - 1)].x;
    let xMax = Math.min(width - nodesLeft - 1, furthestPrevNode + 1);

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
    console.log(xMin, xMax, leftLeaning, '|', x);

    let node = CoreGen.createNode(x, y, Constants.elements[i]);
    node.group = groupId;
    currLevel[node.x] = node;
    addedNodes.push(node);
  }
  console.log(addedNodes);

  // Connect the new nodes and the old nodes
  let possibleConnections = getAllConnections(prevNodes, addedNodes);

  console.log('possible connections');
  console.log(possibleConnections);
  let connections = Random.getRandomElement(possibleConnections);
  validateNodeConnections(connections, prevNodes, null); // No need to validate
}

/*
// what I can get
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

// what I need
[ // all connections
  [ // node-connection arrays
    [1, 0], // node index 0
    [-1, 0] // node index 1
  ],
  [
    [0],
    [0]
  ],
]

 */
function getAllConnections(prevNodes, addedNodes) {
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

    connections.push(expandConnections(nodeConnections, []));
  }

  // Trim connection possibilities by validating all permutations
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

/* takes in an array, returns an array of arrays
[1, 0] -->
  [
    [1, 0], [1], [0]
  ]

 */
function expandConnections(connections, foundExpansions) {
  if (connections.length === 0) {
    return [];
  }

  if (foundExpansions.includes(Helper.strJoin(connections))) {
    return [];
  }
  foundExpansions.push(Helper.strJoin(connections));

  let connectionsCopy = [].concat(connections);
  let expanded = [connectionsCopy];
  for (let i = 0; i < connections.length; i++) {
    let spliced = connections.splice(i, 1)[0];
    let expand = expandConnections(connections, foundExpansions);
    if (expand.length > 0) {
      expanded = expanded.concat(expand);
    }
    connections.splice(i, 0, spliced);
  }

  return expanded;
}

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

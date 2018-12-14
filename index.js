const Timer = require('tiny-timer');
const SeedRandom = require('seedrandom');

// let rand = SeedRandom(2, { global: true });
const randSeed = 8;
let rand = SeedRandom(randSeed);

// INPUT
const width = 7;
const height = 25;
const resetHeights = [7, 6];
const showGrid = true;

// CONSTANTS
const minNodeGroups = 1;
const maxNodeGroups = 3;

const minNodesPerGroup = 1;
const maxNodesPerGroup = 4;

const maxNodesPerLevel = 6;

const minStartingNodes = 3;
const maxStartingNodes = 5;

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

// Get variations (i.e. [2, 3])
const foundVariations = [];
const allowedGroupVariations = allowedGroups.reduce((allGroups, group) => {
  addGroups(allGroups, group, []);
  return allGroups;
}, []);

const elements = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const levels = [];

// Generate starting nodes
const startingNodes = getRandomInt(minStartingNodes, maxStartingNodes);

let startX = getRandomInt(0, 2);
let y = 0;

levels.push(createLevel());
let startLevel = levels[0];
for (let i = 0; i < startingNodes && startX < width; i++) {
  let node = createNode(startX, y, elements[i]);
  startLevel[node.x] = node;

  startX += getRandomInt(1, 2);
}

// Generate starting groups
generateGroups(startLevel);

console.log('----------');
console.log('starting grid');
printLevels(levels, showGrid);
console.log('----------');

// Timer execution
const interval = 200;
const seconds = height;

let timer = new Timer(interval);
timer.on('tick', tick);
timer.on('statusChanged', status => console.log('Timer Status:', status));
timer.start(seconds * interval);

/*
let temp = 25;
for (let i = 0; i < temp; i++) {
  printLevels(levels);
  console.log('----------');
  tick(i + 1);
}

printLevels(levels, true);
 */

function tick(timeLeft) {
  console.log('tick | time left', timeLeft);
  if (timeLeft === 0) {
    return;
  }

  levels.push(createLevel());
  y++;

  let currLevel = levels[y];
  let prevLevel = levels[y - 1];

  // Gather the groups
  let groups = [];
  for (let i = 0; i < maxNodeGroups; i++) {
    let groupId = i + 1;
    let groupNodes = prevLevel.reduce((gn, node) => {
      if (node && node.group === groupId) {
        gn.push(node);
      }
      return gn;
    }, []);

    if (groupNodes.length > 0) {
      groups.push({
        group: groupId,
        nodes: groupNodes
      });
    }
  }

  // For each group, estimate how many nodes it will have
  // This must be done separately because we need the total group count
  // This step is done before generating nodes to ensure we leave
  // space for every group as we generate earlier groups' nodes
  let numGroups = groups.length;
  let total = 0;
  for (let i = 0; i < numGroups; i++) {
    // Estimate how many new nodes for the group
    let group = groups[i];
    let numNodes = group.nodes.length + getRandomInt(-1, 2);
    if (numNodes < minNodesPerGroup) {
      numNodes = minNodesPerGroup;
    } else if (numNodes > maxNodesPerGroup) {
      numNodes = maxNodesPerGroup;
    }

    let maxX = Math.max.apply(null, group.nodes.map(n => n.x));
    while (
      total + numNodes + (numGroups - i - 1) > maxNodesPerLevel ||
      numNodes > width - maxX
    ) {
      numNodes--;
    }

    group.count = numNodes;
    total += numNodes;
  }
  groups.forEach(groupInfo => {
    let groupNodeCount = groupInfo.count;
    total -= groupNodeCount;
    addGroupNodesFromNodes(currLevel, groupInfo.nodes, groupNodeCount, total);
  });

  // Reset groups if necessary
  if (resetHeights.length > 0) {
    resetHeights[0]--;
    if (resetHeights[0] === 0) {
      resetHeights.shift();
      generateGroups(currLevel);
    }
  }

  printLevels(levels, showGrid);
  console.log('----------');
}

function getRandomInt(min, max) {
  return min + Math.floor(rand() * (max - min + 1));
}

function getRandomIndex(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function createLevel() {
  const level = [];
  for (let i = 0; i < width; i++) {
    level.push(null);
  }
  return level;
}

function createNode(x, y, element) {
  return {
    x: x,
    y: y,
    element: element,
    group: -1,
    next: []
  };
}

function generateGroups(level) {
  console.log('generating groups for level: ');
  console.log(level);
  let possibleGroups = allowedGroupVariations.reduce((groups, check) => {
    if (nodesFitInGrouping(check, level)) {
      groups.push(check);
    }
    return groups;
  }, []);

  if (possibleGroups.length === 0) {
    console.error('no groups!');
    possibleGroups = [allowedGroupVariations[0]];
  }

  console.log('possible groups');
  console.log(possibleGroups);
  let group = getRandomIndex(possibleGroups);

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

    let maxGroupSeperation = inGroup;
    for (let j = 0; j < maxGroupSeperation && x < width; j++) {
      let node = level[x++];
      // console.log(group, i, groupId, '|', node ? node.element : ' ', j, found);
      if (node) {
        node.group = groupId + 1;
        node.element = elements[found];
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

function addGroups(allGroups, group, start) {
  if (group.length === 1) {
    const group1 = start.concat(group);
    if (!foundVariations.includes(gs(group1))) {
      foundVariations.push(gs(group1));
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

function gs(group) {
  return group.reduce((str, num) => {
    return str + num + ',';
  }, '');
}

function addGroupNodesFromNodes(currLevel, prevNodes, numToAdd, nodesLeft) {
  const skipWeight = [1, 1, 1, 1, 2];
  console.log('----------');

  let groupId = prevNodes[0].group;

  let addedNodes = [];
  for (let i = 0; i < numToAdd; i++) {
    let prevX = Math.max.apply(null, currLevel.map(n => (n ? n.x : -1)));
    let xMin = Math.max(
      prevX + getRandomIndex(skipWeight),
      Math.min.apply(null, prevNodes.map(n => n.x)) - 1
    );
    let xMax = Math.min(
      width - nodesLeft - 1,
      Math.min.apply(null, prevNodes.map(n => n.x)) + 1 + i
    );

    // If there's only one node left, we need extra logic to ensure that
    // all prev nodes can reach at least one node
    if (numToAdd - i === 1) {
      xMin = Math.max(xMin, Math.max.apply(null, prevNodes.map(n => n.x)) - 1);
    }

    // We're at the edge -- can't add more nodes to add
    if (xMin > xMax) {
      if (addedNodes.length === 0) {
        xMin = xMax;
      } else {
        break;
      }
    }

    // Lean left --> (min, max) of (1, 3) becomes (1, 1, 1, 2, 2, 3)
    const leanStrength = [0, 0, 0, 1];
    let leftLeaning = [];
    for (let val = xMin; val <= xMax; val++) {
      let delta = Math.max(0, xMax - val - getRandomIndex(leanStrength));
      for (let j = 0; j < delta + 1; j++) {
        leftLeaning.push(val);
      }
    }

    let x = getRandomIndex(leftLeaning);
    console.log(xMin, xMax, leftLeaning, '|', x);

    let node = createNode(x, y, elements[i]);
    node.group = groupId;
    currLevel[node.x] = node;
    addedNodes.push(node);
  }

  console.log(
    'added nodes | group',
    groupId,
    '| adding',
    numToAdd,
    '| left',
    nodesLeft
  );
  console.log(addedNodes);

  // Connect the new nodes and the old nodes
  let possibleConnections = getAllConnections(prevNodes, addedNodes);

  console.log('possible connections');
  console.log(possibleConnections);
  let connections = getRandomIndex(possibleConnections);
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

  if (foundExpansions.includes(gs(connections))) {
    return [];
  }
  foundExpansions.push(gs(connections));

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
  if (validated.includes(gs(set))) {
    return;
  }
  validated.push(gs(set));

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

function printLevels(toPrint, printGrid) {
  for (let i = toPrint.length - 1; i >= 0; i--) {
    let level = toPrint[i];

    // Print connections
    if (toPrint[i + 1]) {
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
    level.forEach(node => {
      levelString += printGrid ? '| ' : '  ';
      if (node) {
        levelString += nodeText(node.group, node.element);
      } else {
        levelString += printGrid ? ' - ' : '   ';
      }
      levelString += ' ';
    });
    levelString += printGrid ? '|' : ' ';
    levelString += ' ' + i;
    console.log(levelString);
  }
}

function nodeText(group, element) {
  return '' + group + '-' + element;
}

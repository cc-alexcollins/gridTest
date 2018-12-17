const Helper = require('./helper');

exports.randSeed = 8;

exports.minNodeGroups = 1;
exports.maxNodeGroups = 3;

exports.minNodesPerGroup = 1;
exports.maxNodesPerGroup = 4;

exports.maxNodesPerLevel = 6;

exports.minStartingNodes = 3;
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

// Get variations (i.e. [2, 3])
const foundVariations = [];
exports.allowedGroupVariations = allowedGroups.reduce((allGroups, group) => {
  addGroups(allGroups, group, []);
  return allGroups;
}, []);

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

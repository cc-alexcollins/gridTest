## Modules

<dl>
<dt><a href="#module_AlgorithmWrapper">AlgorithmWrapper</a></dt>
<dd><p>Contains a wrapper for the various grid generator algorithms</p>
</dd>
<dt><a href="#module_Constants">Constants</a></dt>
<dd><p>Generation constant values</p>
</dd>
<dt><a href="#module_CoreGen">CoreGen</a></dt>
<dd><p>Core generation methods and objects</p>
</dd>
<dt><a href="#module_GroupGen">GroupGen</a></dt>
<dd><p>Group-based node generation</p>
</dd>
<dt><a href="#module_Helper">Helper</a></dt>
<dd><p>Contains printing and other helper methods</p>
</dd>
<dt><a href="#module_Main">Main</a></dt>
<dd><p>Entry point for grid generation</p>
</dd>
<dt><a href="#module_Random">Random</a></dt>
<dd><p>Helper class for generating random numbers</p>
</dd>
</dl>

<a name="module_AlgorithmWrapper"></a>

## AlgorithmWrapper
Contains a wrapper for the various grid generator algorithms


* [AlgorithmWrapper](#module_AlgorithmWrapper)
    * _static_
        * [.setGenAlgorithm(algorithm)](#module_AlgorithmWrapper.setGenAlgorithm)
        * [.genStart(options, grid)](#module_AlgorithmWrapper.genStart)
        * [.genNext(grid)](#module_AlgorithmWrapper.genNext)
    * _inner_
        * [~GenAlgorithms](#module_AlgorithmWrapper..GenAlgorithms)
        * [~GenOptions](#module_AlgorithmWrapper..GenOptions)

<a name="module_AlgorithmWrapper.setGenAlgorithm"></a>

### AlgorithmWrapper.setGenAlgorithm(algorithm)
Sets the grid generation algorithm

**Kind**: static method of [<code>AlgorithmWrapper</code>](#module_AlgorithmWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| algorithm | [<code>GenAlgorithms</code>](#module_AlgorithmWrapper..GenAlgorithms) | The algorithm to use for generation |

<a name="module_AlgorithmWrapper.genStart"></a>

### AlgorithmWrapper.genStart(options, grid)
Starts grid generation by setting up the base set of levels based on the
current algorithm

**Kind**: static method of [<code>AlgorithmWrapper</code>](#module_AlgorithmWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>GenOptions</code>](#module_AlgorithmWrapper..GenOptions) | The options to use during generation |
| grid | [<code>Array.&lt;Level&gt;</code>](#module_CoreGen..Level) | The grid object to generate into |

<a name="module_AlgorithmWrapper.genNext"></a>

### AlgorithmWrapper.genNext(grid)
Generates the next level of the grid using the current generation algorithm

**Kind**: static method of [<code>AlgorithmWrapper</code>](#module_AlgorithmWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| grid | [<code>Array.&lt;Level&gt;</code>](#module_CoreGen..Level) | The grid object to generate into |

<a name="module_AlgorithmWrapper..GenAlgorithms"></a>

### AlgorithmWrapper~GenAlgorithms
All of the available algorithms for grid generation

**Kind**: inner constant of [<code>AlgorithmWrapper</code>](#module_AlgorithmWrapper)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| group | [<code>GroupGen</code>](#module_GroupGen) | Group generation algorithm |

<a name="module_AlgorithmWrapper..GenOptions"></a>

### AlgorithmWrapper~GenOptions
Contains the properties that can be used to customize grid
generation

**Kind**: inner typedef of [<code>AlgorithmWrapper</code>](#module_AlgorithmWrapper)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| width | <code>int</code> | The max width of the grid at all levels |
| height | <code>int</code> | The height of the fully-generated grid |
| resetHeights | <code>array</code> | **GroupGen only.** The places to reset the node groups to allow the paths to reconnect. |

<a name="module_Constants"></a>

## Constants
Generation constant values


* [Constants](#module_Constants)
    * [~minNodeGroups](#module_Constants..minNodeGroups) ⇒ <code>int</code>
    * [~maxNodeGroups](#module_Constants..maxNodeGroups) ⇒ <code>int</code>
    * [~minNodesPerGroup](#module_Constants..minNodesPerGroup) ⇒ <code>int</code>
    * [~maxNodesPerGroup](#module_Constants..maxNodesPerGroup) ⇒ <code>int</code>
    * [~maxNodesPerLevel](#module_Constants..maxNodesPerLevel) ⇒ <code>int</code>
    * [~minStartingNodes](#module_Constants..minStartingNodes) ⇒ <code>int</code>
    * [~maxStartingNodes](#module_Constants..maxStartingNodes) ⇒ <code>int</code>
    * [~allowedGroupVariations](#module_Constants..allowedGroupVariations) ⇒ <code>Array.&lt;Array.&lt;int&gt;&gt;</code>
    * [~elements](#module_Constants..elements) ⇒ <code>Array.&lt;string&gt;</code>

<a name="module_Constants..minNodeGroups"></a>

### Constants~minNodeGroups ⇒ <code>int</code>
The minimum number of groups a given level can have

**Kind**: inner constant of [<code>Constants</code>](#module_Constants)  
**Returns**: <code>int</code> - The number of groups  
<a name="module_Constants..maxNodeGroups"></a>

### Constants~maxNodeGroups ⇒ <code>int</code>
The maximum number of groups a given level can have

**Kind**: inner constant of [<code>Constants</code>](#module_Constants)  
**Returns**: <code>int</code> - The number of groups  
<a name="module_Constants..minNodesPerGroup"></a>

### Constants~minNodesPerGroup ⇒ <code>int</code>
The minimum number of nodes a given group can have

**Kind**: inner constant of [<code>Constants</code>](#module_Constants)  
**Returns**: <code>int</code> - The number of nodes in a group  
<a name="module_Constants..maxNodesPerGroup"></a>

### Constants~maxNodesPerGroup ⇒ <code>int</code>
The maximum number of nodes a given group can have

**Kind**: inner constant of [<code>Constants</code>](#module_Constants)  
**Returns**: <code>int</code> - The number of nodes in a group  
<a name="module_Constants..maxNodesPerLevel"></a>

### Constants~maxNodesPerLevel ⇒ <code>int</code>
The maximum number of nodes a single level can have across all groups

**Kind**: inner constant of [<code>Constants</code>](#module_Constants)  
**Returns**: <code>int</code> - The number of nodes for a level  
<a name="module_Constants..minStartingNodes"></a>

### Constants~minStartingNodes ⇒ <code>int</code>
The minimum number of nodes to start the grid with. Only applies
to the first level.

**Kind**: inner constant of [<code>Constants</code>](#module_Constants)  
**Returns**: <code>int</code> - The number of nodes  
<a name="module_Constants..maxStartingNodes"></a>

### Constants~maxStartingNodes ⇒ <code>int</code>
The maximum number of nodes to start the grid with. Only applies
to the first level.

**Kind**: inner constant of [<code>Constants</code>](#module_Constants)  
**Returns**: <code>int</code> - The number of nodes  
<a name="module_Constants..allowedGroupVariations"></a>

### Constants~allowedGroupVariations ⇒ <code>Array.&lt;Array.&lt;int&gt;&gt;</code>
All of the legal group variation permutations

**Kind**: inner constant of [<code>Constants</code>](#module_Constants)  
**Returns**: <code>Array.&lt;Array.&lt;int&gt;&gt;</code> - The group variations, with each variation being an array of integers indexed
by group, and the integer being the count in that group  
<a name="module_Constants..elements"></a>

### Constants~elements ⇒ <code>Array.&lt;string&gt;</code>
The name of the node within a given level. Used for printing.

**Kind**: inner constant of [<code>Constants</code>](#module_Constants)  
**Returns**: <code>Array.&lt;string&gt;</code> - The name of the node for printing  
<a name="module_CoreGen"></a>

## CoreGen
Core generation methods and objects


* [CoreGen](#module_CoreGen)
    * [~createLevel(width)](#module_CoreGen..createLevel) ⇒ [<code>Level</code>](#module_CoreGen..Level)
    * [~createNode(x, y, element)](#module_CoreGen..createNode) ⇒ [<code>Node</code>](#module_CoreGen..Node)
    * [~Node](#module_CoreGen..Node)
    * [~Level](#module_CoreGen..Level)

<a name="module_CoreGen..createLevel"></a>

### CoreGen~createLevel(width) ⇒ [<code>Level</code>](#module_CoreGen..Level)
Creates an empty level (row) for the grid. Each index represents an
x-coordinate for the nodes.

**Kind**: inner method of [<code>CoreGen</code>](#module_CoreGen)  
**Returns**: [<code>Level</code>](#module_CoreGen..Level) - A new level with every element set to `null`  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | How many nodes can fit in the level |

<a name="module_CoreGen..createNode"></a>

### CoreGen~createNode(x, y, element) ⇒ [<code>Node</code>](#module_CoreGen..Node)
Creates a new node in the grid

**Kind**: inner method of [<code>CoreGen</code>](#module_CoreGen)  
**Returns**: [<code>Node</code>](#module_CoreGen..Node) - A new node  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate of the node |
| y | <code>number</code> | The y coordinate of the node |
| element | <code>string</code> | The identifier for the node within a level |

<a name="module_CoreGen..Node"></a>

### CoreGen~Node
A single cell in a grid of nodes.

**Kind**: inner typedef of [<code>CoreGen</code>](#module_CoreGen)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate of the node |
| y | <code>number</code> | The y coordinate of the node |
| element | <code>string</code> | The identifier for the node within a level |
| group | <code>number</code> | The group identifier for the node relative to the previous level |
| next | <code>array</code> | The branches that this node provides to the next level of nodes `-1` means up and left, `0` means straight up, and `1` means up and right |

<a name="module_CoreGen..Level"></a>

### CoreGen~Level
An single row in a grid of nodes. Cells without nodes are
marked as `null`.

**Kind**: inner typedef of [<code>CoreGen</code>](#module_CoreGen)  
<a name="module_GroupGen"></a>

## GroupGen
Group-based node generation


* [GroupGen](#module_GroupGen)
    * _static_
        * [.start(options, grid)](#module_GroupGen.start)
        * [.next(grid)](#module_GroupGen.next)
    * _inner_
        * [~generateGroups(level)](#module_GroupGen..generateGroups)
        * [~nodesFitInGrouping(group, levelNodes)](#module_GroupGen..nodesFitInGrouping) ⇒ <code>boolean</code>
        * [~generateNodesOnGrid(grid)](#module_GroupGen..generateNodesOnGrid)
        * [~addNodesForGroupToLevel(group, currLevel, nodesLeft)](#module_GroupGen..addNodesForGroupToLevel)
        * [~getAllConnections(prevNodes, addedNodes)](#module_GroupGen..getAllConnections) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;int&gt;&gt;&gt;</code>
        * [~validateConnections(connections, set, fromNodes, toNodes, validated)](#module_GroupGen..validateConnections) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;int&gt;&gt;&gt;</code>
        * [~validateNodeConnections(connections, fromNodes, toNodes)](#module_GroupGen..validateNodeConnections) ⇒ <code>boolean</code>
        * [~Group](#module_GroupGen..Group)

<a name="module_GroupGen.start"></a>

### GroupGen.start(options, grid)
Starts generation for a grid of nodes.

Creates the first level randomly, then assigns random groups based on the
positions of the nodes in the level.

**Kind**: static method of [<code>GroupGen</code>](#module_GroupGen)  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>GenOptions</code>](#module_AlgorithmWrapper..GenOptions) | The width, height, and other options to use when generating the grid |
| grid | [<code>Array.&lt;Level&gt;</code>](#module_CoreGen..Level) | The grid object to generate into |

<a name="module_GroupGen.next"></a>

### GroupGen.next(grid)
Generates the next level for a grid of nodes.

Basic algorithm
1. Gather the nodes from the previous level by their group
2. Calculate how many nodes each group should get on the next level
    - Takes into account the positions of groups
3. For each group, add the new nodes calculated in the last step
4. Connect each node in the previous level to the nodes in new level,
as long as they are in the same group
5. At specified breakpoints, reset the groups to cause paths to merge

**Kind**: static method of [<code>GroupGen</code>](#module_GroupGen)  

| Param | Type | Description |
| --- | --- | --- |
| grid | [<code>Array.&lt;Level&gt;</code>](#module_CoreGen..Level) | The grid object to generate into |

<a name="module_GroupGen..generateGroups"></a>

### GroupGen~generateGroups(level)
Calculates and assigns groups for the nodes in the specified level

**Kind**: inner method of [<code>GroupGen</code>](#module_GroupGen)  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>CoreGen~Level</code> | The level to assign groups to |

<a name="module_GroupGen..nodesFitInGrouping"></a>

### GroupGen~nodesFitInGrouping(group, levelNodes) ⇒ <code>boolean</code>
Checks if the specified nodes fit in a grouping

**Kind**: inner method of [<code>GroupGen</code>](#module_GroupGen)  
**Returns**: <code>boolean</code> - Whether the nodes fit or not  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>Array.&lt;int&gt;</code> | A grouping definition -- see {module:Constants~allowedGroupVariations} |
| levelNodes | <code>type</code> | The nodes to try and fit in the grouping |

<a name="module_GroupGen..generateNodesOnGrid"></a>

### GroupGen~generateNodesOnGrid(grid)
Performs the node generation for the next level

**Kind**: inner method of [<code>GroupGen</code>](#module_GroupGen)  

| Param | Type | Description |
| --- | --- | --- |
| grid | [<code>Array.&lt;Level&gt;</code>](#module_CoreGen..Level) | The grid object to generate into |

<a name="module_GroupGen..addNodesForGroupToLevel"></a>

### GroupGen~addNodesForGroupToLevel(group, currLevel, nodesLeft)
Creates and adds nodes for the specified group to the specified level

**Kind**: inner method of [<code>GroupGen</code>](#module_GroupGen)  

| Param | Type | Description |
| --- | --- | --- |
| group | [<code>Group</code>](#module_GroupGen..Group) | The group to generate nodes for |
| currLevel | [<code>Level</code>](#module_CoreGen..Level) | The level to add the nodes to |
| nodesLeft | <code>int</code> | How much space needs to be left for the remaining groups that are yet to be generated. Clamps the max node spread for the group. |

<a name="module_GroupGen..getAllConnections"></a>

### GroupGen~getAllConnections(prevNodes, addedNodes) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;int&gt;&gt;&gt;</code>
Calculates all the various ways that the nodes in `prevNodes` can be
connected to the nodes in `addedNodes`.

From inner to outer, the result contains these values:
* The integers are connections between two nodes
* The integer arrays are the connections for a given node
* The array of integer arrays is the connections for all the nodes in a set
* The array that holds that is all of the permutations of connection sets

It ends up looking like this:
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

**Kind**: inner method of [<code>GroupGen</code>](#module_GroupGen)  
**Returns**: <code>Array.&lt;Array.&lt;Array.&lt;int&gt;&gt;&gt;</code> - A 3-deep array -- array of array of integer arrays  

| Param | Type | Description |
| --- | --- | --- |
| prevNodes | <code>type</code> | Description |
| addedNodes | <code>type</code> | Description |

<a name="module_GroupGen..validateConnections"></a>

### GroupGen~validateConnections(connections, set, fromNodes, toNodes, validated) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;int&gt;&gt;&gt;</code>
Returns the subset of node connectivity that properly connect all nodes
in the `fromNodes` set to those in the `toNodes` set.

The input is an array of node connections. The output is an array of
connectivity possibilities.

**Kind**: inner method of [<code>GroupGen</code>](#module_GroupGen)  
**Returns**: <code>Array.&lt;Array.&lt;Array.&lt;int&gt;&gt;&gt;</code> - The node connectivity arrays that correctly connect all of the nodes  

| Param | Type | Description |
| --- | --- | --- |
| connections | <code>Array.&lt;Array.&lt;Array.&lt;int&gt;&gt;&gt;</code> | All of the possible connections for each node in `toNodes` |
| set | <code>Array.&lt;int&gt;</code> | The current set of connections that is being checked |
| fromNodes | [<code>Array.&lt;Node&gt;</code>](#module_CoreGen..Node) | The nodes being connected. Each of these *must* connect to at least one node in the `toNodes`. |
| toNodes | [<code>Array.&lt;Node&gt;</code>](#module_CoreGen..Node) | The nodes being connected to |
| validated | <code>Array.&lt;string&gt;</code> | The connectivity sets that have already been validated, used for duplicate protection |

<a name="module_GroupGen..validateNodeConnections"></a>

### GroupGen~validateNodeConnections(connections, fromNodes, toNodes) ⇒ <code>boolean</code>
Sets the `next` connections for each of the `fromNodes`, then validates
that those connections work to connect them to the `toNodes`.

Also performs additional validation based on fixed rules.

**Kind**: inner method of [<code>GroupGen</code>](#module_GroupGen)  
**Returns**: <code>boolean</code> - `true` if the connections match up, `false` otherwise  

| Param | Type | Description |
| --- | --- | --- |
| connections | <code>Array.&lt;Array.&lt;int&gt;&gt;</code> | The connections for each of the `fromNodes` |
| fromNodes | [<code>Array.&lt;Node&gt;</code>](#module_CoreGen..Node) | The nodes being connected from |
| toNodes | [<code>Array.&lt;Node&gt;</code>](#module_CoreGen..Node) | The nodes being connected to. If `null`, just sets the `fromNode` connections and returns `true`. |

<a name="module_GroupGen..Group"></a>

### GroupGen~Group
A group for nodes at a given level to fit into

**Kind**: inner typedef of [<code>GroupGen</code>](#module_GroupGen)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| groupId | <code>int</code> | The id of the group |
| prevNodes | [<code>Array.&lt;Node&gt;</code>](#module_CoreGen..Node) | The nodes for this group in the previous level of the grid |
| minAdded | <code>int</code> | The minimum number of nodes that are needed in this group so that all nodes from the previous level of the group can have at least 1 connection |
| count | <code>int</code> | The maximum number of nodes this group will try to have |

<a name="module_Helper"></a>

## Helper
Contains printing and other helper methods


* [Helper](#module_Helper)
    * [~strJoin(array)](#module_Helper..strJoin) ⇒ <code>string</code>
    * [~printGrid(gridToPrint, printGrid, visibleRows)](#module_Helper..printGrid)
    * [~nodeText(group, element)](#module_Helper..nodeText) ⇒ <code>string</code>
    * [~arrayPermutations(connections, foundPermutations)](#module_Helper..arrayPermutations) ⇒ <code>Array.&lt;Array.&lt;int&gt;&gt;</code>

<a name="module_Helper..strJoin"></a>

### Helper~strJoin(array) ⇒ <code>string</code>
Generates a comma-separated string with all the array elements in the
specified group. Used to keep track of duplicate arrays during an
operation as the result of this can be considered a unique key.

**Kind**: inner method of [<code>Helper</code>](#module_Helper)  
**Returns**: <code>string</code> - The elements in the array as a comma-separated string  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | The list of elements to create combine into a string |

<a name="module_Helper..printGrid"></a>

### Helper~printGrid(gridToPrint, printGrid, visibleRows)
Prints all of the nodes of all a series of levels to form a grid structure

**Kind**: inner method of [<code>Helper</code>](#module_Helper)  

| Param | Type | Description |
| --- | --- | --- |
| gridToPrint | <code>any</code> | An array of levels to print |
| printGrid | <code>boolean</code> | Whether the gridlines should be printed |
| visibleRows | <code>int</code> | How many rows will show up in the console |

<a name="module_Helper..nodeText"></a>

### Helper~nodeText(group, element) ⇒ <code>string</code>
Gets a string representation of a node. The format is:
`"{group}-{element}"`

**Kind**: inner method of [<code>Helper</code>](#module_Helper)  
**Returns**: <code>string</code> - The node's string representation.  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>number</code> | The group the node is in |
| element | <code>string</code> | The name of the element |

<a name="module_Helper..arrayPermutations"></a>

### Helper~arrayPermutations(connections, foundPermutations) ⇒ <code>Array.&lt;Array.&lt;int&gt;&gt;</code>
Takes in an array and returns an array of arrays which represents all
possible permutations of the input array's elements, including the input.

This means that input of [0, 1] becomes:
```
[
  [0], [1], [0, 1]
]
```

**Kind**: inner method of [<code>Helper</code>](#module_Helper)  
**Returns**: <code>Array.&lt;Array.&lt;int&gt;&gt;</code> - The permutations of the input array  

| Param | Type | Description |
| --- | --- | --- |
| connections | <code>Array.&lt;int&gt;</code> | The base array to expand |
| foundPermutations | <code>Array.&lt;string&gt;</code> | Duplicate protection |

<a name="module_Main"></a>

## Main
Entry point for grid generation


* [Main](#module_Main)
    * _static_
        * [.run(options)](#module_Main.run)
    * _inner_
        * [~Options](#module_Main..Options)

<a name="module_Main.run"></a>

### Main.run(options)
Generates and displays a grid using the specified input

**Kind**: static method of [<code>Main</code>](#module_Main)  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>Options</code>](#module_Main..Options) | The options to use when generating |

<a name="module_Main..Options"></a>

### Main~Options
Customizable options for the grid generator

**Kind**: inner typedef of [<code>Main</code>](#module_Main)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| seed | <code>number</code> | The number to see the RNG with |
| genAlgorithm | [<code>GenAlgorithms</code>](#module_AlgorithmWrapper..GenAlgorithms) | The algorithm to run when generating the paths on the grid |
| genOptions | [<code>GenOptions</code>](#module_AlgorithmWrapper..GenOptions) | The options that determine the grid output |
| showGrid | <code>boolean</code> | Whether to print out the grid `|`s or not |
| time | <code>number</code> | The number of seconds generation should take. This controls the timer. |

<a name="module_Random"></a>

## Random
Helper class for generating random numbers


* [Random](#module_Random)
    * [~init(seed)](#module_Random..init)
    * [~getRandomInt(min, max)](#module_Random..getRandomInt) ⇒ <code>number</code>
    * [~getRandomElement(array)](#module_Random..getRandomElement) ⇒ <code>any</code>

<a name="module_Random..init"></a>

### Random~init(seed)
Initializes the random number generator with the specified seed

**Kind**: inner method of [<code>Random</code>](#module_Random)  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>number</code> | The number to seed the RNG with |

<a name="module_Random..getRandomInt"></a>

### Random~getRandomInt(min, max) ⇒ <code>number</code>
Gets a random number between `min` (inclusive) and `max` (inclusive)

**Kind**: inner method of [<code>Random</code>](#module_Random)  
**Returns**: <code>number</code> - The randomly generated number  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>number</code> | The smallest possible number to generate |
| max | <code>number</code> | The largest possible number to generate |

<a name="module_Random..getRandomElement"></a>

### Random~getRandomElement(array) ⇒ <code>any</code>
Gets a random element in the array. All elements have an equal chance of
being picked.

**Kind**: inner method of [<code>Random</code>](#module_Random)  
**Returns**: <code>any</code> - The element in the array that was selected. If the array is
empty, returns `undefined`.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | The array to get elements from |


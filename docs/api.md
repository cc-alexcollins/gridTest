## Modules

<dl>
<dt><a href="#module_AlgorithmWrapper">AlgorithmWrapper</a></dt>
<dd><p>Contains a wrapper for the various grid generator algorithms</p>
</dd>
<dt><a href="#module_CoreGen">CoreGen</a></dt>
<dd><p>Core generation methods and objects</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#strJoin">strJoin(array)</a> ⇒ <code>string</code></dt>
<dd><p>Generates a comma-separated string with all the array elements in the
specified group. Used to keep track of duplicate arrays during an
operation as the result of this can be considered a unique key.</p>
</dd>
<dt><a href="#printGrid">printGrid(gridToPrint, printGrid)</a></dt>
<dd><p>Prints all of the nodes of all a series of levels to form a grid structure</p>
</dd>
<dt><a href="#nodeText">nodeText(group, element)</a> ⇒ <code>string</code></dt>
<dd><p>Gets a string representation of a node. The format is:
<code>&quot;{group}-{element}&quot;</code></p>
</dd>
<dt><a href="#getRandomInt">getRandomInt(min, max)</a> ⇒ <code>number</code></dt>
<dd><p>Gets a random number between <code>min</code> (inclusive) and <code>max</code> (inclusive)</p>
</dd>
<dt><a href="#getRandomElement">getRandomElement(array)</a> ⇒ <code>any</code></dt>
<dd><p>Gets a random element in the array. All elements have an equal chance of
being picked.</p>
</dd>
</dl>

<a name="module_AlgorithmWrapper"></a>

## AlgorithmWrapper
Contains a wrapper for the various grid generator algorithms

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
| showGrid | <code>boolean</code> | Whether to print out the grid `|`s or not |
| resetHeights | <code>array</code> | GroupGen only. The places to reset the node groups to allow the paths to reconnect. |

<a name="module_CoreGen"></a>

## CoreGen
Core generation methods and objects


* [CoreGen](#module_CoreGen)
    * [~createLevel(width)](#module_CoreGen..createLevel) ⇒ [<code>Level</code>](#module_CoreGen..Level)
    * [~createNode(x, y, element, group)](#module_CoreGen..createNode) ⇒ [<code>Node</code>](#module_CoreGen..Node)
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

### CoreGen~createNode(x, y, element, group) ⇒ [<code>Node</code>](#module_CoreGen..Node)
Creates a new node in the grid

**Kind**: inner method of [<code>CoreGen</code>](#module_CoreGen)  
**Returns**: [<code>Node</code>](#module_CoreGen..Node) - A new node  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x coordinate of the node |
| y | <code>number</code> | The y coordinate of the node |
| element | <code>string</code> | The identifier for the node within a level |
| group | <code>number</code> | The group identifier for the node relative to the previous level |

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
| next | <code>array</code> | The branches that this node provides to the next level of nodes |

<a name="module_CoreGen..Level"></a>

### CoreGen~Level
An single row in a grid of nodes. Cells without nodes are
marked as `null`.

**Kind**: inner typedef of [<code>CoreGen</code>](#module_CoreGen)  
<a name="strJoin"></a>

## strJoin(array) ⇒ <code>string</code>
Generates a comma-separated string with all the array elements in the
specified group. Used to keep track of duplicate arrays during an
operation as the result of this can be considered a unique key.

**Kind**: global function  
**Returns**: <code>string</code> - The elements in the array as a comma-separated string  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | The list of elements to create combine into a string |

<a name="printGrid"></a>

## printGrid(gridToPrint, printGrid)
Prints all of the nodes of all a series of levels to form a grid structure

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| gridToPrint | <code>any</code> | An array of levels to print |
| printGrid | <code>boolean</code> | Whether the gridlines should be printed |

<a name="nodeText"></a>

## nodeText(group, element) ⇒ <code>string</code>
Gets a string representation of a node. The format is:
`"{group}-{element}"`

**Kind**: global function  
**Returns**: <code>string</code> - The node's string representation.  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>number</code> | The group the node is in |
| element | <code>string</code> | The name of the element |

<a name="getRandomInt"></a>

## getRandomInt(min, max) ⇒ <code>number</code>
Gets a random number between `min` (inclusive) and `max` (inclusive)

**Kind**: global function  
**Returns**: <code>number</code> - The randomly generated number  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>number</code> | The smallest possible number to generate |
| max | <code>number</code> | The largest possible number to generate |

<a name="getRandomElement"></a>

## getRandomElement(array) ⇒ <code>any</code>
Gets a random element in the array. All elements have an equal chance of
being picked.

**Kind**: global function  
**Returns**: <code>any</code> - The element in the array that was selected. If the array is
empty, returns `undefined`.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | The array to get elements from |


import {
  AnimatedLayoutOptions,
  BoundingBox12,
  BoundingBoxWH,
  SortingFunction
} from 'cytoscape'

class BaseLayoutOptionsImpl {

  ready(e: cytoscape.LayoutEventObject): void {
    // tslint:disable-next-line:no-console
    console.debug(`layout ready, cytoscape.LayoutEventObject: ${JSON.stringify(e)}`) // on layoutready
  }

  stop(e: cytoscape.LayoutEventObject): void {
    // tslint:disable-next-line:no-console
    console.debug(`layout stop, cytoscape.LayoutEventObject: ${JSON.stringify(e)}`) // on layoutstop
  }
}

export class NullLayoutOptionsImpl extends BaseLayoutOptionsImpl {
  name = 'null'
}

export class AnimateLayoutOptionsImpl  extends BaseLayoutOptionsImpl implements AnimatedLayoutOptions  {

  // the zoom level to set (prob want fit = false if set)
  zoom: number =  null
  // the pan level to set (prob want fit = false if set)
  pan: number =  null
  // whether to transition the node positions
  animate = false
  // duration of animation in ms if enabled
  animationDuration = 500
  // easing of animation if enabled
  animationEasing = undefined
  // a function that determines whether the node should be animated.
  // All nodes animated by default on animate enabled.  Non-animated nodes are
  // positioned immediately when the layout starts
  animateFilter = ( node, i ) => true
}

export class PresetLayoutOptionsImpl  extends AnimateLayoutOptionsImpl {
  name = 'preset'

  fit?: boolean
  padding?: number

  // map of (node id) => (position obj); or function(node){ return somPos; }
  positions: null
  // transform a given node position. Useful for changing flow direction in discrete layouts
  transform = (node, position ) => position
}

export class ShapedLayoutOptionsImpl extends AnimateLayoutOptionsImpl {

  // whether to fit to viewport
  fit = true
  // fit padding
  padding = 30
  // constrain layout bounds
  boundingBox?: BoundingBox12 | BoundingBoxWH | undefined = null

  // prevents node overlap, may overflow boundingBox if not enough space
  avoidOverlap = true

  // Excludes the label when calculating node bounding boxes for the layout algorithm
  nodeDimensionsIncludeLabels = false
  // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  spacingFactor = 1.75

  // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  sort?: SortingFunction = null
  // transform a given node position. Useful for changing flow direction in discrete layouts
  transform = (node, position ) => position
}


export class GridLayoutOptionsImpl  extends ShapedLayoutOptionsImpl {
  name = 'grid'

  // extra spacing around nodes when avoidOverlap: true
  avoidOverlapPadding = 10
  // uses all available space on false, uses minimal space on true
  condense = false
  // force num of rows in the grid
  rows?: number | undefined = null
  // force num of columns in the grid
  cols?: number | undefined = null
  // returns { row, col } for element
  // (node: NodeSingular) => return { row: number; col: number; }
  position = null
}

export class RandomLayoutOptionsImpl extends AnimateLayoutOptionsImpl {
  name = 'random'

  fit = true
  padding = 20
  // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  boundingBox: cytoscape.BoundingBox12 | cytoscape.BoundingBoxWH | undefined = null
  // transform a given node position. Useful for changing flow direction in discrete layouts
  transform = (node, position ) => position
}

export class CircleLayoutOptionsImpl extends ShapedLayoutOptionsImpl {
  name =  'circle'

  radius: number // the radius of the circle
  startAngle: number = 3 / 2 * Math.PI // where nodes start in radians
  sweep: number = null // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
}

// Note: "radius" is not part of concentric, imperfect extension
export class ConcentricLayoutOptionsImpl {
  name = 'concentric'
  // how many radians should be between the first and last node (defaults to full circle)
  sweep?: number
  // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  clockwise?: boolean
  // where nodes start in radians, e.g. 3 / 2 * Math.PI,
  startAngle: number = 3 / 2 * Math.PI
  fit: boolean
  nodeDimensionsIncludeLabels: true
  equidistant: false // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  minNodeSpacing: 10 // min spacing between outside of nodes (used for radius adjustment)
  boundingBox: null // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  // height of layout area (overrides container height)
  height = null
  // width of layout area (overrides container width)
  width = null
  // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  spacingFactor: null

  concentric(node: { degree(): number }): number {
    return 0
  }

  levelWidth(node: { maxDegree(): number }): number {
    return 0
  }
}

export class BreadthFirstLayoutOptionsImpl extends ShapedLayoutOptionsImpl {
  name = 'breadthfirst'

  // whether the tree is directed downwards (or edges can point in any direction if false)
  directed = false
  // put depths in concentric circles if true, put depths top down if false
  circle = false
  // the roots of the trees
  roots?: string
  // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
  maximalAdjustments: number
  // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
  maximal = false
  grid = false // whether to create an even grid into which the DAG is placed (circle:false only)
  nodeDimensionsIncludeLabels: false // Excludes the label when calculating node bounding boxes for the layout algorithm
}

export class CoseLayoutOptionsImpl extends ShapedLayoutOptionsImpl {
  name = 'cose'

  // The layout animates only after this many milliseconds for animate:true
  // (prevents flashing on fast runs)
  animationThreshold: 250

  // Number of iterations between consecutive screen positions update
  refresh = 20

  // Randomize the initial positions of the nodes (true) or use existing positions (false)
  randomize = false

  // Extra spacing between components in non-compound graphs
  componentSpacing = 40

  // Node repulsion (overlapping) multiplier
  nodeOverlap = 4

  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor = 1.2

  // Gravity force (constant)
  gravity = 1

  // Maximum number of iterations to perform
  numIter = 1000

  // Initial temperature (maximum node displacement)
  initialTemp = 1000

  // Cooling factor (how the temperature is reduced between consecutive iterations
  coolingFactor = 0.99

  // Lower temperature threshold (below this point the layout will end)
  minTemp = 1.0

  // Node repulsion (non overlapping) multiplier
  nodeRepulsion =  ( node ) => 2048

  // Ideal edge (non nested) length
  idealEdgeLength = ( edge ) => 32

  // Divisor to compute edge forces
  edgeElasticity = ( edge ) => 32
}

type RankDir = 'LR' | 'TB'
type Ranker = 'network-simplex' | 'tight-tree' | 'longest-path'

export class DagreLayoutOptionsImpl extends ShapedLayoutOptionsImpl {
  constructor() {
    super()
  }

  name = 'dagre'

  nodeSep: number = null // the separation between adjacent nodes in the same rank
  edgeSep: number = null // the separation between adjacent edges in the same rank
  rankSep: number = null // the separation between each rank in the layout
  // TB for top to bottom flow, 'LR' for left to right
  rankDir: RankDir = 'TB'
  // Type of algorithm to assign a rank to each node in the input graph.
  // Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
  ranker: Ranker = null
  // number of ranks to keep between the source and target of the edge
  minLen = ( edge ) => 1
  edgeWeight = ( edge ) => 1 // higher weight edges are generally made shorter and straighter than lower weight edges
}

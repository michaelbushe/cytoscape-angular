import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import { LayoutOptions } from 'cytoscape'
import { BreadthFirstLayoutOptionsImpl, CircleLayoutOptionsImpl, ConcentricLayoutOptionsImpl, CoseLayoutOptionsImpl,
  DagreLayoutOptionsImpl, GridLayoutOptionsImpl, NullLayoutOptionsImpl, PresetLayoutOptionsImpl, RandomLayoutOptionsImpl
} from '../layout/layout-options-impl'
import { FieldInfo, FieldsetInfo, FormInfo } from '../fluid-form/FormInfo'

@Component({
  selector: 'cytoscape-layout-tool',
  styles: [
    `
      :host {
        width: 400px;
        height: 2em;
      }

      .layout-header {
        width: 100%;
        height: 20px;
      }

      .layout-dropdown {
        padding-right: 10px;
      }

      input:disabled {
        background-color: rgba(204, 204, 204, .33);
      }
    `
  ],
  template: `
    <div>
      <div style="display: flex;">
        <div class="layout-header">Edit Layout</div>
      </div>
      <p-dropdown class="layout-dropdown"
        name="selectedLayoutInfo"
        [options]="layoutOptionsList"
        [(ngModel)]="layoutOptions"
        optionLabel="name"
      ></p-dropdown>
      <button class="apply-button" pButton label="Apply" [disabled]="!changed" (click)="onApplyLayout()"></button>
    </div>
    <cyng-fluid-form [model]="layoutOptions" [formInfo]="formInfo" (modelChange)="onFormModelChange()"></cyng-fluid-form>
  `})
export class CytoscapeLayoutToolComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  private static LAYOUT_FORM_INFO: FormInfo

  @ViewChild('layoutForm') layoutForm;

  _layoutOptions: any
  changed = false

  @Input()
  get layoutOptions(): any {
    return this._layoutOptions
  }
  set layoutOptions(value) {
    console.log(`set layoutOptions: ${value?.name}`)
    this._layoutOptions = value
  }
  @Output() layoutOptionsChange: EventEmitter<LayoutOptions> = new EventEmitter<LayoutOptions>()

  public layoutOptionsList: LayoutOptions[] = [
    new BreadthFirstLayoutOptionsImpl(),
    new CoseLayoutOptionsImpl(),
    new DagreLayoutOptionsImpl(),
    new CircleLayoutOptionsImpl(),
    new ConcentricLayoutOptionsImpl(),
    new GridLayoutOptionsImpl(),
    new PresetLayoutOptionsImpl(),
    new RandomLayoutOptionsImpl(),
    new NullLayoutOptionsImpl(),
  ]

  formInfo: FormInfo

  constructor() {
  }

  ngOnInit(): void {
    this.formInfo = CytoscapeLayoutToolComponent.createLayoutFormInfo()
    let layoutOptionsSelect = this.layoutOptionsList[5]
    console.log('setting the initial selected layout, default: ', layoutOptionsSelect.name)
    if (this.layoutOptions) {
      console.log(`setting  the initial selected layout based on input/output layout ${JSON.stringify(this.layoutOptions)}`)
      this.addOrReplaceInLayoutOptionsList(this.layoutOptions)
    }
    console.log('Initializing this.selectedLayoutInfo with layoutOptionsSelect ', JSON.stringify(layoutOptionsSelect))
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges layout changes:', JSON.stringify(changes))
    if (changes['layoutOptions']) {

    }
  }

  ngAfterViewInit(): void {
   // console.debug("ngAfterViewInit")
  }

  ngAfterViewChecked(): void {
   // console.debug("ngAfterViewChecked")
  }

  onFormModelChange() {
    console.log('onFormModelChange')
    this.changed = true
  }

  onApplyLayout() {
    this.changed = false
    this.layoutOptionsChange.emit(this.layoutOptions)
  }

  private addOrReplaceInLayoutOptionsList(layoutOptions: LayoutOptions): void {
    let matchingOptions = this.layoutOptionsList.find(selectOption => selectOption.name === layoutOptions.name)
    if (matchingOptions) {
      console.log('got matching layoutOptions: ', JSON.stringify(matchingOptions))
      this.layoutOptionsList.splice(this.layoutOptionsList.indexOf(matchingOptions), 1, layoutOptions)
    } else {
      console.info(`Did you pass a new kind of layout?  The layout name ${name} was not found, adding a new one to the top of the list.`)
      this.layoutOptionsList.unshift(layoutOptions)
    }
  }

  private static createLayoutFormInfo(): FormInfo {
    if (!CytoscapeLayoutToolComponent.LAYOUT_FORM_INFO) {
      let fit = new FieldInfo('Fit', 'fit', 'boolean', 'Whether to fit to viewport')
      let padding = new FieldInfo('Padding', 'padding', 'number','When fit to viewport, padding inside the viewport.')

      let fitFieldset = new FieldsetInfo('Fit', [
        fit, padding
      ], ['fit'])

      const zoom = new FieldInfo('Zoom', 'zoom', 'number','the zoom level to set (likely want fit = false if set)')
      const pan = new FieldInfo('Pan', 'pan', 'number','the pan level to set (likely want fit = false if set)')
      const animate = new FieldInfo('Animate', "animate", 'boolean', "whether to transition the node positions")
      const animationDuration = new FieldInfo("Animation Duration", 'animationDuration', 'number',"duration of animation in ms if enabled")
      const animationEasing = new FieldInfo("Animation Easing", 'animationEasing', 'number',"easing of animation if enabled")
      let animationFieldset = new FieldsetInfo('Animation', [
        zoom, pan, animate, animationDuration, animationEasing
      ], ['animate'])


      let avoidOverlap = new FieldInfo('Avoid Overlap', 'avoidOverlap', 'boolean','prevents node overlap, may overflow boundingBox if not enough space')
      let spacingFactor = new FieldInfo('Spacing Factor', 'spacingFactor', 'number','Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up')
      let nodeDimensionsIncludeLabels = new FieldInfo('Node Dimensions Include Labels', 'nodeDimensionsIncludeLabels', 'boolean', 'Excludes the label when calculating node bounding boxes for the layout algorithm')
      let shapedFieldset = new FieldsetInfo('Shaped', [
        avoidOverlap, spacingFactor, nodeDimensionsIncludeLabels
      ], ['avoidOverlap'])

      let directed = new FieldInfo('Directed', 'breadthFirst', 'boolean', 'whether the tree is breadthFirst downwards (or edges can point in any direction if false)')
      let circle = new FieldInfo('Circle', 'circle', 'boolean','put depths in concentric circles if true, put depths top down if false')
      let maximalAdjustments = new FieldInfo('Maximal Adjustments', 'maximalAdjustments', 'number', 'how many times to try to position the nodes in a maximal way (i.e. no backtracking)')
      let maximal = new FieldInfo('Maximal', 'maximal', 'boolean', 'whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)')
      let grid = new FieldInfo('Grid', 'grid', 'boolean', 'whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)')
      let roots = new FieldInfo('Roots', 'roots', 'string', 'the roots of the trees')
      let breadthFirstFieldset = new FieldsetInfo('Breadth First', [
        directed, circle, maximalAdjustments, maximal, grid, roots
      ], ['breadthFirst'])

      let nodeSep = new FieldInfo('Node Separation', 'nodeSep', 'number', 'the separation between adjacent nodes in the same rank')
      let edgeSep = new FieldInfo('Edge Separation', 'edgeSep', 'number', 'the separation between adjacent edges in the same rank')
      let rankSep = new FieldInfo('Rank Separation', 'rankSep', 'number', 'the separation between each rank in the layout')
      let ranker = new FieldInfo('Ranker', 'ranker', 'options', 'Type of algorithm to assign a rank to each node in the input graph.')
      ranker.options = [
        {name: '', label: ''},
        {name: 'network-simplex', label: 'network-simplex'},
        {name: 'tight-tree', label: 'tight-tree'},
        {name: 'longest-path', label: 'longest-path'}]

      let dagreFieldset = new FieldsetInfo('Dagre', [
        nodeSep, edgeSep, rankSep, ranker
      ], ['nodeSep'])

      let animationThreshold = new FieldInfo('Animation Threshold', 'animationThreshold', 'number', 'The layout animates only after this many milliseconds when animate is true (prevents flashing on fast runs)')
      let refresh = new FieldInfo('Refresh', 'refresh', 'number',
        'Number of iterations between consecutive screen positions update')
      let randomize = new FieldInfo('Randomize', 'randomize', 'boolean', 'Randomize the initial positions of the nodes (true) or use existing positions (false)')
      let componentSpacing = new FieldInfo('Component Spacing', 'componentSpacing', 'number', 'Extra spacing between components in non-compound graphs')
      let nodeOverlap = new FieldInfo('Node Overlap', 'nodeOverlap', 'number', 'Node repulsion (overlapping) multiplier')
      let nestingFactor = new FieldInfo('Nesting Factor', 'nestingFactor', 'number', 'Nesting factor (multiplier) to compute ideal edge length for nested edges')
      let gravity = new FieldInfo('Gravity', 'gravity', 'number', 'Gravity force (constant)')
      let numIter = new FieldInfo('Max Iterations', 'numIter', 'number', 'Maximum number of iterations to perform')
      let initialTemp = new FieldInfo('Initial Temp', 'initialTemp', 'number', 'Initial temperature (maximum node displacement)')
      let coolingFactor = new FieldInfo('Cooling Factor', 'coolingFactor', 'number', 'Cooling factor (how the temperature is reduced between consecutive iterations')
      let minTemp = new FieldInfo('Min. Temp', 'minTemp', 'number', 'Lower temperature threshold (below this point the layout will end)')
      let coseFieldset = new FieldsetInfo('COSE', [
        animationThreshold, refresh, randomize, componentSpacing, nodeOverlap, nestingFactor, gravity, numIter,
        initialTemp, coolingFactor, minTemp
      ], ['coolingFactor'])

      let avoidOverlapPadding = new FieldInfo('avoidOverlapPadding', 'avoidOverlapPadding', 'number', 'extra spacing around nodes when avoidOverlap: true')
      let condense = new FieldInfo('condense', 'condense', 'boolean', 'uses all available space on false, uses minimal space on true')
      let rows = new FieldInfo('Rows', 'rows', 'number', 'force num of rows in the grid')
      let cols = new FieldInfo('Columns', 'cols', 'number', 'force num of columns in the grid')

      let gridFieldset = new FieldsetInfo('Grid', [
        avoidOverlapPadding, condense, rows, cols
      ], ['cols'])

      let radius = new FieldInfo('Radius', 'radius', 'number', 'the radius of the circle')
      let startAngle = new FieldInfo('Start Angle', 'startAngle', 'number', 'where nodes start in radians (default:3 / 2 * Math.PI)')
      let sweep = new FieldInfo('Sweep', 'sweep', 'number', 'how many radians should be between the first and last node (defaults to full circle)')
      let clockwise = new FieldInfo('Clockwise', 'clockwise', 'number', 'whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)')
      let circularFieldSet = new FieldsetInfo('Circular', [
        radius, startAngle, sweep, clockwise
      ], ['clockwise'])

      let equidistant = new FieldInfo('Equidistant', 'equidistant', 'boolean', 'whether levels have an equal radial distance betwen them, may cause bounding box overflow')
      let minNodeSpacing = new FieldInfo('Min. Node Spacing', 'minNodeSpacing', 'number', 'min spacing between outside of nodes (used for radius adjustment)')
      let height = new FieldInfo('Height', 'height', 'number', '')
      let width = new FieldInfo('Width', 'width', 'number', '')
      let concentricFieldSet = new FieldsetInfo('Concentric', [
        equidistant, minNodeSpacing, startAngle, height, width
      ], ['equidistant'])

      //boundingBox: undefined // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }

      CytoscapeLayoutToolComponent.LAYOUT_FORM_INFO = new FormInfo('Layout',
        [
          breadthFirstFieldset, coseFieldset, dagreFieldset, gridFieldset, circularFieldSet, concentricFieldSet,
          fitFieldset, animationFieldset, shapedFieldset ],
        false)
    }
    return CytoscapeLayoutToolComponent .LAYOUT_FORM_INFO
  }
}
/*
    <!--

      Dagre
        // Type of algorithm to assign a rank to each node in the input graph.
        // Possible values:
        c = undefined
        // number of ranks to keep between the source and target of the edge
        minLen = ( edge ) => { return 1 }
        edgeWeight = ( edge ) => { return 1 } // higher weight edges are generally made shorter and straighter than lower weight edges

    AnimateLayoutOptionsImpl
      // a function that determines whether the node should be animated.
      // All nodes animated by default on animate enabled.  Non-animated nodes are
      // positioned immediately when the layout starts
      animateFilter = ( node, i ) => true

      Preset
      // map of (node id) => (position obj); or function(node){ return somPos; }
      positions: undefined

      Shaped
        // constrain layout bounds
        boundingBox?: BoundingBox12 | BoundingBoxWH | undefined = undefined

        // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        sort?: SortingFunction = undefined
        // transform a given node position. Useful for changing flow direction in discrete layouts
        transform = (node, position ) => position

      //Grid
        // returns { row, col } for element
        // (node: NodeSingular) => return { row: number; col: number; }
        position = undefined

      //Random
        // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        boundingBox: cytoscape.BoundingBox12 | cytoscape.BoundingBoxWH | undefined = undefined
        // transform a given node position. Useful for changing flow direction in discrete layouts
        transform = (node, position ) => position

      //Circular
      //Conecntric
        concentric(node: { degree(): number }): number {
          eturn 0
        }

        levelWidth(node: { maxDegree(): number }): number {
          return 0
        }

        Breadth First

         CoseLayoutOptionsImpl

          // Node repulsion (non overlapping) multiplier
          nodeRepulsion =  function( node ){ return 2048 }

          // Ideal edge (non nested) length
          idealEdgeLength = ( edge ) => { return 32 }

          // Divisor to compute edge forces
          edgeElasticity = ( edge ) => 32

    -->
 */

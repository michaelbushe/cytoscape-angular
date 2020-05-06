import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output, ViewChild
} from '@angular/core'
import { LayoutOptions } from 'cytoscape'
import {
  BreadthFirstLayoutOptionsImpl,
  CircleLayoutOptionsImpl,
  ConcentricLayoutOptionsImpl,
  CoseLayoutOptionsImpl,
  DagreLayoutOptionsImpl, GridLayoutOptionsImpl,
  NullLayoutOptionsImpl,
  PresetLayoutOptionsImpl,
  RandomLayoutOptionsImpl
} from '../layout/layout-options-impl'

class LayoutInfo {
  name: string
  layout: any
}

@Component({
  selector: 'cytoscape-layout-tool',
  styles: [
    `
      :host {
        width: 400px;
        height: 2em;
      }

      .layoutHeader {
        width: 100%;
        height: 20px;
      }

      p-fieldset > fieldset {
        width: 400px;
      }

      input:disabled {
        background-color: rgba(204, 204, 204, .33);
      }

      p-inputSwitch {
        padding-left: 10px;
      }

      close-button {
        max-height: 18px;
        height: 18px;
        padding: 5px;
        margin-bottom: 5px;
      }
    `
  ],
  template: `
    <div style="display: flex;">
      <div class="layoutHeader">Layouts</div>
      <div>&nbsp;</div>
      <button pButton class="close-button" style="height: 18px;">&nbsp;X&nbsp;</button>
    </div>
    <p-dropdown
        name="selectedLayoutInfo"
        [options]="layoutInfos"
        [(ngModel)]="selectedLayoutInfo"
        optionLabel="name"
      ></p-dropdown>
    <!--
    Something more generic would be nice...
        <cyto-fluid-form-fieldset model="selectedLayoutInfo" [modelProperty]="'fit'"></cyto-fluid-form-fieldset>
     -->
    <form #layoutForm="ngForm">
      <p-fieldset class="fieldset" legend="Fit" *ngIf="selectedLayoutHasProperty('fit')">
        <div class="ui-g ui-fluid">
          <div class="ui-g-12 ui-md-4">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Fit</span>
              <p-inputSwitch [(ngModel)]="layoutOptions.fit" name="fit"
                             pTooltip="whether to fit to viewport"
                             [disabled]="selectedLayoutDoesntHaveOwnProperty('fit')"></p-inputSwitch>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4" *ngIf="selectedLayoutHasProperty('padding')">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Padding</span>
              <input type="number" pInputText placeholder="Padding"
                     [(ngModel)]="layoutOptions.padding" name="padding"
                     pTooltip="padding around when fit"
                     [disabled]="selectedLayoutDoesntHaveOwnProperty('padding')"/>
            </div>
          </div>
        </div>
      </p-fieldset>
      <p-fieldset class="fieldset" legend="Animation" *ngIf="selectedLayoutHasProperty('animate')">
        <div class="ui-g ui-fluid" *ngIf="selectedLayoutHasProperty('zoom')">
          <div class="ui-g-12 ui-md-4">
            <div class="ui-inputgroup">
              <span class="ui-inputgroup-addon"><i class="pi pi-plus-circle"></i></span>
              <input type="number" pInputText placeholder="Zoom" [(ngModel)]="layoutOptions.zoom" name="zoom"
                     pTooltip="the zoom level to set (likely want fit = false if set)"
                     [disabled]="selectedLayoutDoesntHaveOwnProperty('zoom')"/>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4"  *ngIf="selectedLayoutHasProperty('pan')">
            <div class="ui-inputgroup">
              <input type="number" pInputText placeholder="Pan" [(ngModel)]="layoutOptions.pan" name="pan"
                     pTooltip="the pan level to set (likely want fit = false if set)"
                     [disabled]="selectedLayoutDoesntHaveOwnProperty('pan')"/>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4"  *ngIf="selectedLayoutHasProperty('animate')">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Animate</span>
              <p-inputSwitch [(ngModel)]="layoutOptions.animate" name="animate"
                             pTooltip="whether to transition the node positions"
                             [disabled]="selectedLayoutDoesntHaveOwnProperty('animate')"></p-inputSwitch>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4" *ngIf="selectedLayoutHasProperty('animationDuration')">
            <div class="ui-inputgroup">
              <input type="number" pInputText placeholder="Animation Duration"
                     [(ngModel)]="layoutOptions.animationDuration" name="animationDuration"
                     pTooltip="duration of animation in ms if enabled"
                     [disabled]="selectedLayoutDoesntHaveOwnProperty('animationDuration')"/>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4" *ngIf="selectedLayoutHasProperty('animationEasing')">
            <div class="ui-inputgroup">
              <input type="number" pInputText placeholder="Animation Easing"
                     [(ngModel)]="layoutOptions.animationEasing" name="animationEasing"
                     pTooltip="easing of animation if enabled"
                     [disabled]="selectedLayoutDoesntHaveOwnProperty('animationEasing')"/>
            </div>
          </div>
        </div>
      </p-fieldset>
      <p-fieldset class="fieldset" legend="Shaped" *ngIf="selectedLayoutHasProperty('avoidOverlap')">
        <div class="ui-g ui-fluid" *ngIf="selectedLayoutHasProperty('avoidOverlap')">
          <div class="ui-g-12 ui-md-4">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Avoid Overlap</span>
              <p-inputSwitch [(ngModel)]="layoutOptions.avoidOverlap" name="avoidOverlap"
                             pTooltip="prevents node overlap, may overflow boundingBox if not enough space"
                             [disabled]="selectedLayoutDoesntHaveOwnProperty('avoidOverlap')"></p-inputSwitch>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4" *ngIf="selectedLayoutHasProperty('spacingFactor')">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Spacing Factor</span>
              <p-inputSwitch [(ngModel)]="layoutOptions.spacingFactor" name="spacingFactor"
                             pTooltip="Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up"
                             [disabled]="selectedLayoutDoesntHaveOwnProperty('spacingFactor')"></p-inputSwitch>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4" *ngIf="selectedLayoutHasProperty('nodeDimensionsIncludeLabels')">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Node Dimensions Include Labels</span>
              <p-inputSwitch [(ngModel)]="layoutOptions.nodeDimensionsIncludeLabels" name="nodeDimensionsIncludeLabels"
                             pTooltip="Excludes the label when calculating node bounding boxes for the layout algorithm"
                             [disabled]="selectedLayoutDoesntHaveOwnProperty('nodeDimensionIncludeLabels')"></p-inputSwitch>
            </div>
          </div>
        </div>
      </p-fieldset>
      <p-fieldset class="fieldset" legend="Directed" *ngIf="selectedLayoutHasProperty('directed')">
        <div class="ui-g ui-fluid">
          <div class="ui-g-12 ui-md-4">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Directed</span>
              <p-inputSwitch [(ngModel)]="layoutOptions.directed" name="directed"
                             pTooltip="whether the tree is directed downwards (or edges can point in any direction if false)"
                             [disabled]="selectedLayoutDoesntHaveOwnProperty('directed')"></p-inputSwitch>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4" *ngIf="selectedLayoutHasProperty('circle')">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Circle</span>
              <p-inputSwitch [(ngModel)]="layoutOptions.circle" name="circle"
                             pTooltip="put depths in concentric circles if true, put depths top down if false"
                             [disabled]="selectedLayoutDoesntHaveOwnProperty('circle')"></p-inputSwitch>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4"  *ngIf="selectedLayoutHasProperty('maximalAdjustments')">
            <div class="ui-inputgroup">
              <input type="number" pInputText placeholder="Maximal Adjustments"
                     [(ngModel)]="layoutOptions.maximalAdjustments" name="maximalAdjustments"
                     pTooltip="how many times to try to position the nodes in a maximal way (i.e. no backtracking)"
                     [disabled]="selectedLayoutDoesntHaveOwnProperty('maximalAdjustments')"/>
            </div>
          </div>
          <div class="ui-g-12 ui-md-4" *ngIf="selectedLayoutHasProperty('grid')">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Grid</span>
              <p-inputSwitch [(ngModel)]="layoutOptions.grid" name="grid"
                             pTooltip="whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)"
                             [disabled]="selectedLayoutDoesntHaveOwnProperty('grid')"></p-inputSwitch>
            </div>
          </div>
        </div>
      </p-fieldset>
      <p-fieldset class="fieldset" legend="Dagre" *ngIf="selectedLayoutHasProperty('nodeSep')">
        <div class="ui-g ui-fluid" *ngIf="selectedLayoutHasProperty('nodeSep')">
          <div class="ui-g-12 ui-md-4">
            <div class="ui-inputgroup">
              <input type="number" pInputText placeholder="Node Separation"
                     [(ngModel)]="layoutOptions.nodeSep" name="nodeSep"
                     pTooltip="the separation between adjacent nodes in the same rank"
                     [disabled]="selectedLayoutDoesntHaveOwnProperty('nodeSep')">
            </div>
          </div>
          <div class="ui-g-12 ui-md-4">
            <div class="ui-inputgroup">
              <input type="number" pInputText placeholder="Edge Separation"
                     [(ngModel)]="layoutOptions.edgeSep" name="edgeSep"
                     pTooltip="the separation between adjacent edges in the same rank"
                     [disabled]="selectedLayoutDoesntHaveOwnProperty('edgeSep')">
            </div>
          </div>
          <div class="ui-g-12 ui-md-4">
            <div class="ui-inputgroup">
              <input type="number" pInputText placeholder="Rank Separation"
                     [(ngModel)]="layoutOptions.rankSep" name="rankSep"
                     pTooltip="the separation between each rank in the layout"
                     [disabled]="selectedLayoutDoesntHaveOwnProperty('rankSep')">
            </div>
          </div>
          <div class="ui-g-12 ui-md-4">
            <div class="ui-inputgroup">
              <span class="ui-chkbox-label">Ranker</span>
              <p-dropdown [options]="[{name: 'network-simplex', label:'network-simplex'},
                                      {name: 'tight-tree', label: 'tight-tree'},
                                      {name: 'longest-path', label: 'longest-path'}]"
                  [(ngModel)]="layoutOptions.ranker" name="ranker"
                  pTooltip="Type of algorithm to assign a rank to each node in the input graph."
                  [disabled]="selectedLayoutDoesntHaveOwnProperty('ranker')"></p-dropdown>
            </div>
          </div>
        </div>
      </p-fieldset>
    </form>

    <!--

      Dagre
        // TB for top to bottom flow, 'LR' for left to right
        rankDir = 'TB'
        // Type of algorithm to assign a rank to each node in the input graph.
        // Possible values:
        c = undefined
        // number of ranks to keep between the source and target of the edge
        minLen = ( edge ) => { return 1 }
        edgeWeight = ( edge ) => { return 1 } // higher weight edges are generally made shorter and straighter than lower weight edges


    BReadthFirst
          // the roots of the trees
          roots?: string

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
        // extra spacing around nodes when avoidOverlap: true
        avoidOverlapPadding = 10
        // uses all available space on false, uses minimal space on true
        condense = false
        // force num of rows in the grid
        rows?: number | undefined = undefined
        // force num of columns in the grid
        cols?: number | undefined = undefined
        // returns { row, col } for element
        // (node: NodeSingular) => return { row: number; col: number; }
        position = undefined

      //Random
        fit = true
        padding = 20
        // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        boundingBox: cytoscape.BoundingBox12 | cytoscape.BoundingBoxWH | undefined = undefined
        // transform a given node position. Useful for changing flow direction in discrete layouts
        transform = (node, position ) => position

      //Circular
        radius: number // the radius of the circle
        startAngle: number = 3 / 2 * Math.PI // where nodes start in radians
        sweep: number = undefined // how many radians should be between the first and last node (defaults to full circle)
        clockwise: true // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)

      //Conecntric
        equidistant: false // whether levels have an equal radial distance betwen them, may cause bounding box overflow
        minNodeSpacing: 10 // min spacing between outside of nodes (used for radius adjustment)
        boundingBox: undefined // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        startAngle: number = 3 / 2 * Math.PI
        height = undefined
        width = undefined
        // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        spacingFactor: undefined

        concentric(node: { degree(): number }): number {
          eturn 0
        }

        levelWidth(node: { maxDegree(): number }): number {
          return 0
        }

        Breadth First
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

         CoseLayoutOptionsImpl
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
          nodeRepulsion =  function( node ){ return 2048 }

          // Ideal edge (non nested) length
          idealEdgeLength = ( edge ) => { return 32 }

          // Divisor to compute edge forces
          edgeElasticity = ( edge ) => 32

    -->
  `})
export class CytoscapeLayoutToolComponent implements OnInit, AfterViewInit {
  @ViewChild('layoutForm') layoutForm;

  public layoutInfos: LayoutInfo[] = [
    {name: 'random', layout: new RandomLayoutOptionsImpl()},
    {name: 'dagre', layout: new DagreLayoutOptionsImpl()},
    {name: 'null', layout: new NullLayoutOptionsImpl()},
    {name: 'circle', layout: new CircleLayoutOptionsImpl()},
    {name: 'concentric', layout: new ConcentricLayoutOptionsImpl()},
    {name: 'grid', layout: new GridLayoutOptionsImpl()},
    {name: 'preset', layout: new PresetLayoutOptionsImpl()},
    {name: 'breadthfirst', layout: new BreadthFirstLayoutOptionsImpl()},
    {name: 'cose', layout: new CoseLayoutOptionsImpl()}
    ]

  _layoutOptions: any
  @Input()
  get layoutOptions(): any {
    return this._layoutOptions
  }
  set layoutOptions(value) {
    console.log(`set layoutOptions: ${JSON.stringify(value)}`)
    this._layoutOptions = value
    console.log(`emitting new layout: ${JSON.stringify(this._layoutOptions)}`)
    this.layoutOptionsChange.emit(this._layoutOptions)
  }

  _selectedLayoutInfo: any
  get selectedLayoutInfo(): any {
    return this._selectedLayoutInfo
  }
  set selectedLayoutInfo(value: any) {
    console.log(`updating this._selectedLayoutInfo from selected layout info ${JSON.stringify(value)}`)
    this._selectedLayoutInfo = value
  }

  @Output() layoutOptionsChange: EventEmitter<LayoutOptions> = new EventEmitter<LayoutOptions>()

  constructor() {
  }

  ngOnInit(): void {
    let layoutInfoToSet = this.layoutInfos[5]
    console.log('setting the initial selected layout, default: ', layoutInfoToSet.name)
    if (this.layoutOptions) {
      console.log(`setting  the initial selected layout based on input/output layout ${JSON.stringify(this.layoutOptions)}`)
      layoutInfoToSet = this.createOrUpdateLayoutInfo(this.layoutOptions.name, this.layoutOptions)
    }
    console.log('Initializing this.selectedLayoutInfo with layoutInfoToSet ', JSON.stringify(layoutInfoToSet))
    this.selectedLayoutInfo = layoutInfoToSet
  }

  ngAfterViewInit() {
    let differs = false
    this.layoutForm.form.valueChanges.subscribe(change => {
      console.log(`form change: ${JSON.stringify(change)}
                      \nwith form: , ${JSON.stringify(this.selectedLayoutInfo)}
                      \nand layoutOptions ${JSON.stringify(this.layoutOptions)}`)
      // We don't care about the layout itself changing.
      console.log(`Form changed selected name: ${this.selectedLayoutInfo.name}, output name: ${this.layoutOptions.name}`)
      if (this.selectedLayoutInfo.name !== this.layoutOptions.name) {
        console.log(`Form changed to ${this.selectedLayoutInfo.name} from ${this.layoutOptions.name}`)
        // return
      }
      const newLayoutOptions = {...this.selectedLayoutInfo, ...change, ...{ name: this.selectedLayoutInfo.name} }
      console.log('setting new layoutOptions:', JSON.stringify(newLayoutOptions))
      this.layoutOptions = newLayoutOptions
    })
  }

  private createOrUpdateLayoutInfo(name: string, layoutOptions: LayoutOptions): any {
    let matchingInfo = this.getLayoutInfoForName(name)
    if (matchingInfo) {
      console.log('Got matching info ', JSON.stringify(matchingInfo))
      matchingInfo.layout = {...matchingInfo.layout, ...layoutOptions}
      console.log('new matching info: ', JSON.stringify(matchingInfo))
    } else {
      console.warn(`Did you pass a new kind of layout?  The layout name ${name} was not found, adding a new one to the list`)
      matchingInfo = { name: name, layout: layoutOptions }
      this.layoutInfos.push(matchingInfo)
    }
    return matchingInfo
  }

  private getLayoutInfoForName(name: string): LayoutInfo {
    return this.layoutInfos.find(info => info.name === name)
  }

  // layoutInfoChanged($event: any) {
  //   console.log(`layoutInfoChanged ${JSON.stringify($event.value)}`)
  //   const chosenInfo = this.createOrUpdateLayoutInfo($event.value.name)
  //   if (!chosenInfo) {
  //     console.warn(`Could not find layout info for name ${$event.value.name}`)
  //   } else {
  //     this.layoutOptions = chosenInfo.layout
  //   }
  // }

  selectedLayoutHasProperty(field: string): boolean {
    if (!this.selectedLayoutInfo) {
      return false //not sure why this happens ever
    }
    // if (field === 'fit') {
    //   console.log(`this._layoutOptions: ${JSON.stringify(this.selectedLayoutInfo)}`)
    // }
    // tslint:disable-next-line:forin
    for (const prop in this.selectedLayoutInfo.layout) {
      // console.log(`prop: ${prop}`)
      if (prop === field) {
        // console.log(`selected layout has ${field}`)
        return true
      }
    }
    // console.log(`selected layout has no ${field}`)
    return false
  }

  selectedLayoutDoesntHaveOwnProperty(field: string) {
    return !this.selectedLayoutHasProperty(field)
  }

}

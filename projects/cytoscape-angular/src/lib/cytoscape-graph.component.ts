import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core'
import * as cy from 'cytoscape'
import {
  CytoscapeOptions,
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
  Position,
  SelectionType,
  Stylesheet
} from 'cytoscape'

declare var cytoscape: any

/**
 * The API is a little odd to provide flexibility.
 * EITHER bind to cyOptions (type CytoscapeOptions), to control the options yourself
 * OR this component will build a CytoscapeOptions internally by using all the other inputs.
 * If cyOptions is supplied, all other inputs are ignored.
 * The cyOptions container (HTML element) is always ignored and set internally.
 */
@Component({
  selector: 'cytoscape-graph',
  template: `
    <p-progressSpinner *ngIf="loading" class="spinner" strokeWidth="4" fill="#EEEEEE" animationDuration=".5s"></p-progressSpinner>
    <div #cyGraph class="graphWrapper">
    </div>
  `,
  styles: [`
    .spinner {
      position: absolute;
      left: '50%';
      z-index: 10;
      width: '250px';
      height: '250px';
    }
    @keyframes ui-progress-spinner-color {
      100%,
      0% {
        stroke: #d62d20;
      }
      40% {
        stroke: #0057e7;
      }
      66% {
        stroke: #008744;
      }
      80%,
      90% {
        stroke: #ffa700;
      }
    }
    .graphWrapper {
      height: 100%;
      width: 100%;
    }`
  ]
})
export class CytoscapeGraphComponent implements OnChanges, AfterViewInit {
  @ViewChild('cyGraph')
  cyGraph: ElementRef

  @Input()
  debug: boolean = false

  @Input()
  nodes: NodeDefinition[]
  @Input()
  edges: EdgeDefinition[]

  @Input()
  autolock: boolean
  @Input()
  autoungrabify: boolean
  @Input()
  autounselectify: boolean
  @Input()
  boxSelectionEnabled: boolean
  @Input()
  desktopTapThreshold: number
  @Input()
  hideEdgesOnViewport: boolean
  @Input()
  hideLabelsOnViewport: boolean
  @Input()
  layoutOptions: LayoutOptions
  @Input()
  maxZoom: number
  @Input()
  minZoom: number
  @Input()
  motionBlur: boolean
  @Input()
  motionBlurOpacity: number
  @Input()
  pan: Position
  @Input()
  panningEnabled: boolean
  @Input()
  pixelRatio: number | 'auto'
  @Input()
  selectionType: SelectionType
  @Input()
  style: Stylesheet[]
  @Input()
  styleEnabled: boolean
  @Input()
  textureOnViewport: boolean
  @Input()
  touchTapThreshold: number
  @Input()
  userPanningEnabled: boolean
  @Input()
  userZoomingEnabled: boolean
  @Input()
  wheelSensitivity: number
  @Input()
  zoom: 1
  @Input()
  zoomingEnabled: boolean
  @Input()
  showToolbar = true

  cyOptions: CytoscapeOptions
  private cy: cy.Core
  loading: boolean = false

  constructor() {
  }

  public ngOnChanges(changes: SimpleChanges): any {
    console.log('cytoscape graph component ngOnChanges. changes:', JSON.stringify(changes))
    this.loading = true
    setTimeout(()=> {
      if (changes["style"]) {
        console.log('changes["style"]:', JSON.stringify(changes["style"]))
      }
      this.render()
      setTimeout(() => {
        this.loading = false
      }, 0)
    }, 0)
  }

  ngAfterViewInit(): void {
    this.render()
  }

  public centerElements(selector) {
    if (!this.cy) {
      return
    }
    const elems = this.cy.$(selector)
    this.cy.center(elems)
  }

  public zoomToElement(selector: string, level = 3) {
    let position = this.cy?.$(selector)?.position()
    if (!position) {
      console.warn(`Cannot zoom to ${selector}`)
    }
    this.cy.zoom({
      level: level,
      position: position
    });
  }

  public render() {
    if (!this.cyGraph) {
      console.warn(`No cyGraph found`)
      return
    }

    const cyOptions = this.cyOptions || {
      // ignored, use nodes and edges only?
      // elements: this.elements,
      autolock: this.autolock,
      autoungrabify: this.autoungrabify,
      autounselectify: this.autounselectify,
      boxSelectionEnabled: this.boxSelectionEnabled,
      container: this.cyGraph.nativeElement,
      desktopTapThreshold: this.desktopTapThreshold,
      hideEdgesOnViewport: this.hideEdgesOnViewport,
      hideLabelsOnViewport: this.hideLabelsOnViewport,
      layout: this.layoutOptions,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      motionBlur: this.motionBlur,
      motionBlurOpacity: this.motionBlurOpacity,
      pan: this.pan,
      panningEnabled: this.panningEnabled,
      pixelRatio: this.pixelRatio,
      selectionType: this.selectionType,
      style: this.style,
      styleEnabled: this.styleEnabled,
      textureOnViewport: this.textureOnViewport,
      touchTapThreshold: this.touchTapThreshold,
      userPanningEnabled: this.userPanningEnabled,
      userZoomingEnabled: this.userZoomingEnabled,
      wheelSensitivity: this.wheelSensitivity,
      zoomingEnabled: this.zoomingEnabled,
      zoom: this.zoom,
    }
    // TODO do reset() instead?
    this.cy = cytoscape(cyOptions)
    console.log(`starting redraw`)
    this.cy.startBatch()
    this.cy.boxSelectionEnabled(this.boxSelectionEnabled)
    this.cy.nodes().remove()
    this.cy.edges().remove()
    this.cy.add(this.nodes)
    this.cy.add(this.edges)
    this.cy.endBatch()
    console.log(`laying out ${this.nodes.length} nodes with ${this.layoutOptions.name}`)
    this.cy.layout(this.layoutOptions).run()
    console.log(`ended redraw`)
  }
}

/*
background-color : The colour of the node’s body.
background-blacken : Blackens the node’s body for values from 0 to 1; whitens the node’s body for values from 0 to -1.
background-opacity : The opacity level of the node’s background colour.
background-fill : The filling bigGraphStylesJSON of the node’s body; may be solid (default), linear-gradient, or radial-gradient.
Gradient:

background-gradient-stop-colors : The colours of the background gradient stops (e.g. cyan magenta yellow).
background-gradient-stop-positions : The positions of the background gradient stops (e.g. 0% 50% 100%). If not specified or invalid, the stops will divide equally.
background-gradient-direction : For background-fill: linear-gradient, this property defines the direction of the background gradient. The following values are accepted:
to-bottom (default)
to-top
to-left
to-right
to-bottom-right
to-bottom-left
to-top-right
to-top-left
Border:

border-width : The size of the node’s border.
border-bigGraphStylesJSON : The bigGraphStylesJSON of the node’s border; may be solid, dotted, dashed, or double.
border-color : The colour of the node’s border.
border-opacity : The opacity of the node’s border.

 */

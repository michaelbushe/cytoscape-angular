import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core'
import { CytoscapeOptions, EdgeDefinition, LayoutOptions, NodeDefinition, Position, SelectionType, Stylesheet } from 'cytoscape'
import * as cy from 'cytoscape'
declare var cytoscape: any
import dagre from 'cytoscape-dagre'

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
    <div #cyGraph class="graphWrapper"></div>
  `,
  styles: [`
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
  style: Stylesheet
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

  constructor(private el: ElementRef) {
  }

  public ngOnChanges(): any {
    console.log(`ngOnChanges this.nodes?.length : ${this.nodes?.length}, this.edges?.length : ${this.edges?.length}`)
    this.render()
  }


  ngAfterViewInit(): void {
    console.log(`ngAfterViewInit this.nodes?.length : ${this.nodes?.length}, this.edges?.length : ${this.edges?.length}`)
    this.render()
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
    console.log(`drawn nodes: ${JSON.stringify(this.nodes)}`)
    // TODO - all events
    // ready: event => {
    //   console.log('cyto ready')
    // },
  }
}

/*
background-color : The colour of the node’s body.
background-blacken : Blackens the node’s body for values from 0 to 1; whitens the node’s body for values from 0 to -1.
background-opacity : The opacity level of the node’s background colour.
background-fill : The filling style of the node’s body; may be solid (default), linear-gradient, or radial-gradient.
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
border-style : The style of the node’s border; may be solid, dotted, dashed, or double.
border-color : The colour of the node’s border.
border-opacity : The opacity of the node’s border.

 */

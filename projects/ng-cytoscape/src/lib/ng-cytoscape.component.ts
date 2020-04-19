import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core'
import * as cy from 'cytoscape'
import { CytoscapeOptions, EdgeDefinition, NodeDefinition } from 'cytoscape'
declare var cytoscape: any

/**
 * The API is a little odd to provide flexiblity.
 * EITHER bind to cyOptions (type CytoscapeOptions), to control the options yourself
 * OR this component will build a CytoscapeOptions internally by using all the other inputs.
 * If cyOptions is supplied, all other inputs are ignored.
 * The cyOptions container (HTML element) is always ignored and set internally.
 */
@Component({
  selector: 'mf-cytoscape-graph',
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
export class CytoscapeComponent implements OnChanges {
  @ViewChild('cyGraph')
  cyGraph: ElementRef

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
  layoutOptions: cytoscape.LayoutOptions
  @Input()
  maxZoom: number
  @Input()
  minZoom: number
  @Input()
  motionBlur: boolean
  @Input()
  motionBlurOpacity: number
  @Input()
  pan: cy.Position
  @Input()
  panningEnabled: boolean
  @Input()
  pixelRatio: number | 'auto'
  @Input()
  selectionType: cy.SelectionType
  @Input()
  style: any
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

  cy: cy.Core
  cyOptions: cy.CytoscapeOptions

  constructor(private el: ElementRef) {
  }

  public ngOnChanges(): any {
    this.render()
  }

  public render() {
    if (!this.cyGraph) {
      console.warn(`No cyGraph found`)
      return
    }

    const cyOptions: CytoscapeOptions = this.cyOptions || {
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
    this.cy.startBatch()
    this.cy.boxSelectionEnabled(this.boxSelectionEnabled)
    this.cy.nodes().remove()
    this.cy.add(this.nodes)
    this.cy.add(this.edges)
    this.cy.endBatch()
    // TODO - all events
    // ready: event => {
    //   console.log('cyto ready')
    // },
  }
}

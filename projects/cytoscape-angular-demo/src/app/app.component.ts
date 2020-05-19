import { Component, HostListener, OnInit, ViewChild } from '@angular/core'
import { EdgeDefinition, NodeDefinition, Stylesheet } from 'cytoscape'
import dagre from 'cytoscape-dagre'
import { CyNodeService } from './cy-node.service'
import {
  CoseLayoutOptionsImpl,
  CytoscapeGraphComponent,
  DagreLayoutOptionsImpl,
  PresetLayoutOptionsImpl
} from 'cytoscape-angular'
import { StylesheetImpl } from '../../../cytoscape-angular/src/lib/style/style'

declare var cytoscape: any

@Component({
  selector: 'app-root',
  template: `
    <h2>Cytoscape-Angular Demo</h2>
    <p>This web app demonstrates the use of
      <a href="https://github.com/michaelbushe/cytoscape-angular">cytoscape-angular</a>, an open source (MIT license)
      library of
      <a href="https://angular.io">Angular</a> components for <a href="https://cytoscape.org/">Cytoscape</a>,
      a widely used graphing tool and the de facto standard graphing tool for bioinformatics.</p>
    <p>cytoscape-angular makes it easy to create cytoscape graphs in high-quality web and mobile applications quickly.
      The source code of this demo is intended to be a starting point for creating a web app for cytoscape
      graphs with canned or live streaming data. The components for interactive layout and styling
      can help to quickly refine graphs.
    <p>cytoscape-angular provides a complete API for <a href="https://js.cytoscape.org/">cytoscape.js</a> in an Angular
      component. Angular is a a comprehensive user interface framework that creates fully deployable web and mobile
      applications quickly. </p>
    <p>cytoscape-angular also provides toolbar components for adjusting layout and style on the fly and
      saving the resulting cytoscape layout json and stylesheet json for rapid graph customization.</p>
    <p>Another app for minds by <a href="https://www.mindfulsoftware.com" style="color: rgb(77, 122, 13)">Mindful
      Software</a> with
      <a href="https://www.kaavio.com" style="color: rgb(34, 23, 183)">Kaavio</a>.
      Data copied from <a href="http://graphspace.org/">Graphspace</a>.
      App and data deployed to <a href="http://firebase.google.com/">Firebase</a>.
      The cytoscape-angular README has directions for deploying your app and canned data to Firebase for (probably)
      free.
    </p>
    <h4>TGF-beta-Receptor</h4>
    <div style="display: flex;">
      <cytoscape-graph #biggraph title="TGF-beta-Receptor"
                       class="medium-graph"
                       debug="true"
                       showToolbar="true"
                       [nodes]="bigGraphNodes"
                       [edges]="bigGraphEdges"
                       [style]="bigGraphStylesheet"
                       [layoutOptions]="bigGraphLayoutOptions">

      </cytoscape-graph>
      <cytoscape-graph-toolbar [(layoutOptions)]="bigGraphLayoutOptions"
                               [(styles)]="bigGraphStylesheet"
                               [showToolbarButtons]="true"
                               (layoutOptionsChange)="bigGraphLayoutToolbarChange($event)"
                               (stylesChange)="bigGraphLayoutStylesToolbarChange($event)"
                               (styleSelectorChange)="bigGraphLayoutStylesSelectorChange($event)"
                               [nodes]="bigGraphNodes"
                               [edges]="bigGraphEdges"
                               direction="column"
      ></cytoscape-graph-toolbar>
    </div>
    <h4>Graph 2 (Layout: {{graph2LayoutOptions.name}})</h4>
    <cytoscape-graph-toolbar [(layoutOptions)]="graph2LayoutOptions"
                             [showToolbarButtons]="true"
                             (layoutOptionsChange)="graph2LayoutToolbarChange($event)"
    ></cytoscape-graph-toolbar>
    <cytoscape-graph #graph2 title="Preset One Two"
                     class="small-graph"
                     debug="true"
                     showToolbar="true"
                     [nodes]="graph2Nodes"
                     [edges]="graph2Edges"
                     [style]="graph2Stylesheet"
                     [layoutOptions]="graph2LayoutOptions">
    </cytoscape-graph>
    <h4>Graph 3 (Layout: {{graph3LayoutOptions.name}})</h4>
    <cytoscape-graph-toolbar [(layoutOptions)]="graph3LayoutOptions"
                             [styles]="graph3Stylesheet"
                             [showToolbarButtons]="true"
                             (layoutOptionsChange)="graph3LayoutToolbarChange($event)">
    </cytoscape-graph-toolbar>
    <cytoscape-graph #graph3 title="Dagre One Two"
                     class="small-graph"
                     debug="true"
                     showToolbar="true"
                     [nodes]="graph3Nodes"
                     [edges]="graph3Edges"
                     [style]="graph3Stylesheet"
                     [layoutOptions]="graph3LayoutOptions">
    </cytoscape-graph>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
      }

      .medium-graph {
        width: 600px;
        height: 600px;
        border: 1px solid rgb(77, 122, 13);
      }

      .small-graph {
        width: 200px;
        height: 200px;
        border: 1px solid rgb(77, 122, 13);
      }
    `
  ]
})
export class AppComponent implements OnInit{
  @ViewChild('biggraph')
  bigGraph: CytoscapeGraphComponent
  @ViewChild('graph2')
  graph2: CytoscapeGraphComponent
  @ViewChild('graph3')
  graph3: CytoscapeGraphComponent

  title = 'cytoscape-angular-demo';
  bigGraphLayoutOptions = new CoseLayoutOptionsImpl()
  bigGraphNodes: NodeDefinition[] = []
  bigGraphEdges: EdgeDefinition[] = []
  graph2LayoutOptions = new PresetLayoutOptionsImpl()
  graph2Nodes: NodeDefinition[] = []
  graph2Edges: EdgeDefinition[] = []
  graph3LayoutOptions = new PresetLayoutOptionsImpl()
  graph3Nodes: NodeDefinition[] = []
  graph3Edges: EdgeDefinition[] = []

  bigGraphStylesheet: Stylesheet[] = [new StylesheetImpl()]
  graph2Stylesheet: Stylesheet[]  = [new StylesheetImpl()]
  graph3Stylesheet: Stylesheet[] = [new StylesheetImpl()]

  constructor(public cyNodeService: CyNodeService) {
  }

  ngOnInit(): void {
    cytoscape.use(dagre)
    let bigChart = 'Signaling-by-Activin TO Signaling-by-TGF-beta-Receptor-Complex k=3' // 'pathogenesis-weighted-test-4'  // 'NetPath-Brain-derived-neurotrophic-factor-(BDNF)-pathway'
    this.cyNodeService.getStylesheet(bigChart).subscribe(stylesheet => {
      return this.cyNodeService.getData(bigChart).subscribe(result => {
        this.stampNodeAndElementGroupsAndDeleteFields(result, ['curve-style'])
        this.bigGraphStylesheet = stylesheet.style
        this.bigGraphNodes = result.elements.nodes
        this.bigGraphEdges = result.elements.edges
      })
    })
    this.graph2Nodes = [
      {
        "data":
          {
            "id":"1",
            "key":"1",
            "label":"One Label",
            "caption":"One  Label",
            "color":"blue",
          },
        "position":{"x":11.7,"y":2.3},
        "classes":"blue",
        "style" : {
          "height":"0.5",
          "width":"2.2277"
        }
      },
      {
        "data":
          {
            "id":"2",
            "key":"2",
            "label":"Two Label",
            "caption":"Two  Label",
            "color":"red"
          },
        "classes":"red",
        "position":{"x":20,"y":20},
      }]
    this.graph2Edges = [{"data":{"source":"1","target":"2","label":"OneToTwoLabel"}}]
    this.graph3Nodes = [
      {"data":
          {"id":"1",
            "key":"1",
            "label":"One Label",
            "caption":"One Label",
            "color":"blue",
          },
        "classes":"blue"
      },
      {"data":
          {"id":"2",
            "key":"2",
            "label":"Two Label",
            "caption":"Two Label",
            "color":"red"
          },
        "classes":"red"}
    ]
    this.graph3Edges = [{"data":{"source":"1","target":"2","label":"OneToTwoLabel"}}]
  }

  @HostListener('window:beforeunload', ['$event'])
  ngOnDestroy() {
    console.log(`on destroy`)
  }

  private stampNodeAndElementGroupsAndDeleteFields(result, edgeFields: string[]) {
    result.elements.nodes.forEach(node => {
      node.group = 'nodes'
    })
    result.elements.edges.forEach(edge => {
      edge.group = 'edges'
      this.deleteFields(edge.style, edgeFields)
    })
  }

  // Without this called with ['curve-bigGraphStylesJSON'], you get:
  // core.js:6272 ERROR Error: An element must have a core reference and parameters set
  // at ke (cytoscape.min.js:23)
  // at new Re (cytoscape.min.js:23)
  // at eo.add (cytoscape.min.js:23)
  // at CytoscapeGraphComponent.render (cytoscape-angular.js:86)
  // at CytoscapeGraphComponent.ngOnChanges (cytoscape-angular.js:37)
  // at CytoscapeGraphComponent.wrapOnChangesHook_inPreviousChangesStorage (core.js:27246)
  // at callHook (core.js:4774)
  // at callHooks (core.js:4734)
  // at executeCheckHooks (core.js:4654)
  // at selectIndexInternal (core.js:9729)
  private deleteFields(object, fields: string[]) {
    fields?.forEach(field => delete object[field])
  }

  bigGraphLayoutToolbarChange($event: any) {
    console.log(`app gets big layout toolbar change ${JSON.stringify($event)}`)
    // this.bigGraphLayoutOptions = {...this.bigGraphLayoutOptions}
    this.bigGraph?.render()
  }

  bigGraphLayoutStylesToolbarChange($event: cytoscape.Stylesheet[]) {
    console.log(`app gets biggraph style toolbar change ${JSON.stringify($event)}`)
    this.bigGraph?.render()
  }

  bigGraphLayoutStylesSelectorChange(selector: string) {
    console.log(`app gets biggraph style selector change: ${JSON.stringify(selector)}`)
    // this.bigGraph?.centerElements(selector)
    this.bigGraph?.zoomToElement(selector)
  }

  graph2LayoutToolbarChange($event: any) {
    console.log(`app gets graph2 layout toolbar change: ${JSON.stringify($event)}`)
    this.graph2?.render()
  }

  graph3LayoutToolbarChange($event: any) {
    console.log(`app gets graph3 layout toolbar change: ${JSON.stringify($event)}`)
    this.graph3?.render()
  }

}

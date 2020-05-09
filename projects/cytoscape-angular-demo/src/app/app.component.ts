import { Component, OnInit } from '@angular/core'
import { EdgeDefinition, NodeDefinition } from 'cytoscape'
import dagre from 'cytoscape-dagre'
import { CyNodeService } from './cy-node.service'

declare var cytoscape: any

@Component({
  selector: 'app-root',
  template: `
    <h2>cytoscape-angular Demo</h2>
    <p>This web app demonstrates the use of
      <a href="https://github.com/michaelbushe/cytoscape-angular">cytoscape-angular</a>, an open source (MIT license) library of
      <a href="https://angular.io">Angular</a> components for <a href="https://cytoscape.org/">Cytoscape</a>,
      a widely used graphing tool and the de facto standard graphing tool for bioinformatics.</p>
    <p>cytoscape-angular makes it easy to create cytoscape graphs in high-quality web and mobile applications quickly.
      The source code of this demo is intended to be a starting point for creating a web app for cytoscape
      graphs with canned or live streaming data.  The components for interactive layout and styling
      can help to quickly refine graphs.
    <p>cytoscape-angular provides a complete API for <a href="https://js.cytoscape.org/">cytoscape.js</a> in an Angular
      component. Angular is a a comprehensive user interface framework that creates fully deployable web and mobile
      applications quickly. </p>
    <p>cytoscape-angular also provides toolbar components for adjusting layout and style on the fly and
      saving the resulting cytoscape layout json and stylesheet json for rapid graph customization.</p>
    <p>Another app for minds by <a href="https://www.mindfulsoftware.com" style="color: rgb(77, 122, 13)">Mindful Software</a> with
      <a href="https://www.kaavio.com" style="color: rgb(34, 23, 183)">Kaavio</a>.
      Data copied from <a href="http://graphspace.org/">Graphspace</a>.
      App and data deployed to <a href="http://firebase.google.com/">Firebase</a>.
      The cytoscape-angular README has directions for deploying your app and canned data to Firebase for (probably) free.
    </p>
      <h4>TGF-beta-Receptor</h4>
      <div style="display: flex;">
        <cytoscape-graph title="TGF-beta-Receptor"
                         class="medium-graph"
                         debug="true"
                         showToolbar="true"
                         [nodes]="bigGraphNodes"
                         [edges]="bigGraphEdges"
                         [style]="bigGraphStylesheet"
                         [layoutOptions]="bigGraphLayoutOptions">

        </cytoscape-graph>
        <cytoscape-graph-toolbar [(layoutOptions)]="bigGraphLayoutOptions"
                                 [showToolbarButtons]="true"
                                 (layoutOptionsChange)="layoutToolbarChange($event)"
                                 [nodes]="bigGraphNodes"
                                 [edges]="bigGraphEdges"
                                 direction="column"
        ></cytoscape-graph-toolbar>
      </div>
      <h4>Graph 2 (Layout: {{graph2LayoutOptions.name}})</h4>
      <cytoscape-graph-toolbar [(layoutOptions)]="graph2LayoutOptions"
                               [showToolbarButtons]="true"
                               (layoutOptionsChange)="layoutToolbarChange($event)"
      ></cytoscape-graph-toolbar>
      <cytoscape-graph title="Preset One Two"
                       class="small-graph"
                       debug="true"
                       showToolbar="true"
                       [nodes]="graph2Nodes"
                       [edges]="graph2Edges"
                       [style]="style"
                       [layoutOptions]="graph2LayoutOptions">

      </cytoscape-graph>
      <h4>Graph 3 (Layout: {{graph3LayoutOptions.name}})</h4>
      <cytoscape-graph-toolbar [(layoutOptions)]="graph3LayoutOptions"
                             [showToolbarButtons]="true">
      </cytoscape-graph-toolbar>
      <cytoscape-graph title="Dagre One Two"
                       class="small-graph"
                       debug="true"
                       showToolbar="true"
                       [nodes]="graph3Nodes"
                       [edges]="graph3Edges"
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
  title = 'cytoscape-angular-demo';
  bigGraphNodes: NodeDefinition[] = []
  bigGraphEdges: EdgeDefinition[] = []
  graph2Nodes: NodeDefinition[] = []
  graph2Edges: EdgeDefinition[] = []
  graph3Nodes: NodeDefinition[] = []
  graph3Edges: EdgeDefinition[] = []
  bigGraphStylesheet: any
  style = [{
      selector: 'node',
      style: {
        width: 'label',
        height: 'label',
        padding: '1px',
        label: 'data(label)',
        color: 'black', //text color
        'background-color': '#CCCCCC',
        'border-color': 'data(color)',
        'border-width': '1px',
        'border-style': 'solid',
        'text-valign' : 'center',
        'text-halign' : 'center',
        'text-wrap': 'ellipsis',
        shape: 'round-rectangle',
        'font-size': '4pt',
      }
    },
    {
      selector: 'edge',
      style: {
        width: 1,
        'curve-style': 'bezier'//curve-style : straight, bezier, unbundled-bezier, segments, taxi, haystack
      }
    }
  ]

  presetLayoutOptions = {
    name: 'preset',
    ready: function(){console.log(' on preset layoutready')}, // on layoutready
    stop: function(){console.log(' on preset layoutstop')} // on layoutstop
  }

  bigGraphLayoutOptions = this.presetLayoutOptions
  graph2LayoutOptions = this.presetLayoutOptions

  dagreLayoutOptions = {
    name: 'dagre',
    fit: true,
    // name: 'preset',
    // nodeSep: 1, // the separation between adjacent nodes in the same rank
    // edgeSep: undefined, // the separation between adjacent edges in the same rank
    // rankSep: undefined, // the separation between each rank in the layout
    // rankDir: 'TB', // 'TB' for top to bottom flow, 'LR' for left to right,
    // tslint:disable-next-line:max-line-length
    // ranker: 'tight-tree', // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
    // minLen: function( edge ){ return 1 }, // number of ranks to keep between the source and target of the edge
    // edgeWeight: function( edge ){ return 1 }, // higher weight edges are generally made shorter and straighter than lower weight edges
    //
    // // general layout options
    // fit: true, // whether to fit to viewport
    // padding: 30, // fit padding
    // spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    // nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
    // animate: false, // whether to transition the node positions
    // tslint:disable-next-line:max-line-length
    // animateFilter: function( node, i ){ return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    // animationDuration: 500, // duration of animation in ms if enabled
    // animationEasing: undefined, // easing of animation if enabled
    // boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    // transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
    ready: function(){console.log(' on layoutready')}, // on layoutready
    stop: function(){console.log(' on layoutstop')} // on layoutstop
  }
  graph3LayoutOptions = this.dagreLayoutOptions


  constructor(public cyNodeService: CyNodeService) {
  }

  ngOnInit(): void {
    cytoscape.use(dagre)
    let bigChart = 'Signaling-by-Activin TO Signaling-by-TGF-beta-Receptor-Complex k=3' // 'pathogenesis-weighted-test-4'  // 'NetPath-Brain-derived-neurotrophic-factor-(BDNF)-pathway'
    this.cyNodeService.getStylesheet(bigChart).subscribe(stylesheet => {
      return this.cyNodeService.getData(bigChart).subscribe(result => {
        this.stampNodeAndElementGroupsAndDeleteFields(result, ['curve-style'])
        this.bigGraphStylesheet = stylesheet
        this.bigGraphNodes = result.elements.nodes
        this.bigGraphEdges = result.elements.edges
      })
    })
    // cyNodeService.get24Neighbors().subscribe(result => {
    //   // console.log(`24 Neighbors: ${JSON.stringify(result)}`)
    //   this.cyChartData24Neighbors =  result
    //   this.neighbor24Nodes = result.elements.nodes
    //   this.neighbor24Edges = result.elements.edges
    //   console.log(`24 Neighbors edges: ${JSON.stringify(result.elements.edges)}`)
    // })
    // this.test2ToBigGraph()
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

  private stampNodeAndElementGroupsAndDeleteFields(result, edgeFields: string[]) {
    result.elements.nodes.forEach(node => {
      node.group = 'nodes'
    })
    result.elements.edges.forEach(edge => {
      edge.group = 'edges'
      this.deleteFields(edge.style, edgeFields)
    })
  }

  // Without this called with ['curve-style'], you get:
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

  layoutToolbarChange($event: any) {
    console.log(`app gets layout toolbar change ${JSON.stringify($event)}`)
  }
}

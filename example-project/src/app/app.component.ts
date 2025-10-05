import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {EdgeDefinition, LayoutOptions, NodeDefinition, Stylesheet} from 'cytoscape';
// @ts-ignore
import dagre from 'cytoscape-dagre'
import { CyNodeService } from './cy-node.service'
import { CoseLayoutOptions, CytoscapeGraphComponent } from 'cytoscape-angular'
import { StylesheetImpl } from '../style/style'
import {combineLatest, Subscription} from 'rxjs'
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
    <p>cytoscape-angular provides a complete API for <a href="https://js.cytoscape.org/">cytoscape.js</a> in an Angular
      component. Angular is a a comprehensive user interface framework that creates fully deployable web and mobile
      applications quickly. </p>
    <p>cytoscape-angular also provides toolbar components for adjusting layout and style on the fly and
      saving the resulting cytoscape layout json and stylesheet json for rapid graph customization.</p>
    <p>Another app for minds by <a href="https://www.mindfulsoftware.com" style="color: rgb(77, 122, 13)">Mindful
      Software</a> with <a href="https://www.kaavio.com" style="color: rgb(34, 23, 183)">Kaavio</a>. Data from <a href="http://graphspace.org/">Graphspace</a>.
    </p>
    <h4>TGF-beta-Receptor</h4>
    <div style="display: flex;">
      <cytoscape-graph #biggraph title="TGF-beta-Receptor"
                       class="medium-graph"
                       [debug]=true
                       [showToolbar]=true
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
    `
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('biggraph')
  bigGraph: CytoscapeGraphComponent | null
  bigGraphLayoutOptions: LayoutOptions = new CoseLayoutOptions()
  bigGraphNodes: NodeDefinition[] = []
  bigGraphEdges: EdgeDefinition[] = []
  bigGraphStylesheet: Stylesheet[] = [new StylesheetImpl()]
  subscription: Subscription | undefined
  title = 'Cytoscape Angular Demo'

  constructor(public cyNodeService: CyNodeService) {
    this.bigGraph = null
  }

  ngOnInit(): void {
    cytoscape.use(dagre)
    const bigChart = 'Signaling-by-Activin TO Signaling-by-TGF-beta-Receptor-Complex k=3'
    const dataObs = this.cyNodeService.getData(bigChart)
    const stylesheetObs = this.cyNodeService.getStylesheet(bigChart)
    this.subscription = combineLatest(dataObs, stylesheetObs).subscribe(([data, stylesheet]) => {
        this.stampNodeAndElementGroupsAndDeleteFields(data, ['curve-style'])
        this.bigGraphStylesheet = stylesheet.style
        this.bigGraphNodes = data.elements.nodes
        this.bigGraphEdges = data.elements.edges
      })
  }

  @HostListener('window:beforeunload', ['$event'])
  ngOnDestroy() {
    console.log(`on destroy`)
    if (this.subscription != null) {
      this.subscription.unsubscribe()
    }
  }

  private stampNodeAndElementGroupsAndDeleteFields(result: any, edgeFields: string[]) {
    // @ts-ignore
    result.elements.nodes.forEach(node => {
      node.group = 'nodes'
    })
    // @ts-ignore
    result.elements.edges.forEach(edge => {
      edge.group = 'edges'
      this.deleteFields(edge.style, edgeFields)
    })
  }

  // Without this called with ['curve-bezier'], you get:
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
  private deleteFields(obj: any, fields: string[]) {
    fields?.forEach(field => delete obj[field])
  }

  bigGraphLayoutToolbarChange($event: any) {
    console.log(`app gets big layout toolbar change ${JSON.stringify($event)}`)
    this.bigGraph?.render()
  }

  bigGraphLayoutStylesToolbarChange($event: cytoscape.Stylesheet[]) {
    console.log(`app gets biggraph style toolbar change ${JSON.stringify($event)}`)
    this.bigGraph?.render()
  }

  bigGraphLayoutStylesSelectorChange(selector: string) {
    console.log(`app gets biggraph style selector change: ${JSON.stringify(selector)}`)
    this.bigGraph?.zoomToElement(selector)
  }

}

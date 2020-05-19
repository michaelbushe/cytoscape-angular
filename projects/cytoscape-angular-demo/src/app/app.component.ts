import { Component, HostListener, OnInit, ViewChild } from '@angular/core'
import { EdgeDefinition, NodeDefinition, Stylesheet } from 'cytoscape'
import dagre from 'cytoscape-dagre'
import { CyNodeService } from './cy-node.service'
import { CoseLayoutOptionsImpl, CytoscapeGraphComponent } from 'cytoscape-angular'
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
export class AppComponent implements OnInit{
  @ViewChild('biggraph')
  bigGraph: CytoscapeGraphComponent
  bigGraphLayoutOptions = new CoseLayoutOptionsImpl()
  bigGraphNodes: NodeDefinition[] = []
  bigGraphEdges: EdgeDefinition[] = []
  bigGraphStylesheet: Stylesheet[] = [new StylesheetImpl()]

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

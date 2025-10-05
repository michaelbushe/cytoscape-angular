import { Component, signal, viewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import type { EdgeDefinition, LayoutOptions, NodeDefinition, StylesheetStyle, Core } from 'cytoscape';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import {
  CytoscapeGraphComponent,
  CytoscapeGraphToolbarComponent,
  CoseLayoutOptions
} from 'cytoscape-angular';
import { firstValueFrom } from 'rxjs';

interface GraphData {
  elements: {
    nodes: NodeDefinition[];
    edges: EdgeDefinition[];
  };
}

interface StylesheetData {
  style: StylesheetStyle[];
}

interface GraphMetadata {
  id: string;
  name: string;
  description: string;
  hasStylesheet: boolean;
}

const AVAILABLE_GRAPHS: GraphMetadata[] = [
  {
    id: 'Signaling-by-Activin TO Signaling-by-TGF-beta-Receptor-Complex k=3',
    name: 'TGF-β Receptor Pathway',
    description: 'This biological pathway shows protein interactions in the Transforming Growth Factor beta (TGF-β) signaling cascade.',
    hasStylesheet: true
  },
  {
    id: 'NetPath-Brain-derived-neurotrophic-factor-(BDNF)-pathway',
    name: 'BDNF Pathway',
    description: 'Brain-Derived Neurotrophic Factor pathway showing neuronal growth and survival signaling mechanisms.',
    hasStylesheet: true
  },
  {
    id: 'pathogenesis-weighted-test-4',
    name: 'Pathogenesis Network',
    description: 'Weighted pathogenesis network showing disease-related protein interactions and pathways.',
    hasStylesheet: true
  },
  {
    id: 'test_2',
    name: 'Test Network 2',
    description: 'Sample biological network for testing and demonstration purposes.',
    hasStylesheet: true
  },
  {
    id: '24NeighborsofRN-tre(MergedIsoforms)',
    name: 'RN-tre Neighbors',
    description: '24 neighboring proteins of RN-tre showing merged isoforms and interactions.',
    hasStylesheet: false
  }
];

/**
 * Demo Application Component
 *
 * Showcases the cytoscape-angular library with:
 * - Dynamic forms that change based on graph type
 * - Graph visualization
 * - Real-world graph data from biological pathways
 * - Angular 20+ architecture with signals
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CytoscapeGraphComponent,
    CytoscapeGraphToolbarComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>
          <img src="cytoscape-sample-graph.png" alt="Cytoscape" class="logo">
          Cytoscape Angular Demo
        </h1>
        <p class="subtitle">
          Modern Angular 20 Component Library for Graph Visualization
        </p>
      </header>

      <div class="content-layout">
        <aside class="info-panel">
          <section class="info-section">
            <h2>About</h2>
            <p>
              This demo showcases <strong>cytoscape-angular</strong>,
              a an Angular 20+ library for the Cytoscape graph visualization engine.
            </p>
          </section>

          <section class="info-section">
            <h3>Select Graph</h3>
            <select class="graph-selector" (change)="onGraphSelect($event)">
              @for (graph of availableGraphs; track graph.id) {
                <option [value]="graph.id" [selected]="graph.id === selectedGraph().id">
                  {{ graph.name }}
                </option>
              }
            </select>

            <h4 class="graph-title">{{ selectedGraph().name }}</h4>
            <p>{{ selectedGraph().description }}</p>

            @if (nodes().length > 0) {
              <div class="stats">
                <div class="stat">
                  <strong>{{ nodes().length }}</strong>
                  <span>Nodes</span>
                </div>
                <div class="stat">
                  <strong>{{ edges().length }}</strong>
                  <span>Edges</span>
                </div>
              </div>
            } @else {
              <p class="loading">Loading graph data...</p>
            }
          </section>

          <section class="info-section highlight">
            <h3>💡 Usage Tip</h3>
            <p>
              Try changing the <strong>Layout Type</strong> in the toolbar.
              Notice how the configuration form automatically updates
              to show relevant options for each layout algorithm.
            </p>
          </section>

          <section class="info-section">
            <h3>Key Features</h3>
            <ul>
              <li><strong>Dynamic Forms</strong> - Forms adapt to selected layout type</li>
              <li><strong>Angular 20</strong> - Latest signals and standalone architecture</li>
              <li><strong>Type-Safe</strong> - Full TypeScript integration</li>
              <li><strong>Reactive</strong> - Proper RxJS patterns throughout</li>
              <li><strong>Material Design</strong> - Modern UI components</li>
              <li><strong>Production Ready</strong> - Comprehensive testing</li>
            </ul>
          </section>
        </aside>

        <main class="graph-container">
          <div class="graph-wrapper">
            @if (nodes().length > 0) {
              <cyng-cytoscape-graph
                #graph
                [nodes]="nodes()"
                [edges]="edges()"
                [style]="stylesheet()"
                [layoutOptions]="layoutOptions()"
                [debug]="true"
                (graphReady)="onGraphReady($event)"
              />

              <cyng-cytoscape-graph-toolbar
                class="graph-toolbar"
                [(layoutOptions)]="layoutOptions"
                [(styles)]="stylesheet"
                [nodes]="nodes()"
                [edges]="edges()"
                [direction]="'column'"
                [showToolbarButtons]="true"
                [showStats]="true"
                (styleSelectorChange)="onSelectorChange($event)"
              />
            } @else {
              <div class="loading-container">
                <p>Loading biological pathway data...</p>
              </div>
            }
          </div>
        </main>
      </div>

      <footer class="app-footer">
        <p>
          Built with <a href="https://angular.dev" target="_blank">Angular 20</a>,
          <a href="https://js.cytoscape.org/" target="_blank">Cytoscape.js</a>, and
          <a href="https://material.angular.io/" target="_blank">Angular Material</a>
        </p>
        <p>
          <a href="https://github.com/michaelbushe/cytoscape-angular" target="_blank">
            View on GitHub
          </a> |
          <a href="https://www.mindfulsoftware.com" target="_blank">
            Mindful Software
          </a>
        </p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .app-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      height: 40px;
      width: auto;
      border-radius: 6px;
      background: white;
      padding: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .subtitle {
      margin: 8px 0 0 0;
      opacity: 0.95;
      font-size: 14px;
    }

    .content-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .info-panel {
      width: 350px;
      background: #f8f9fa;
      border-right: 1px solid #e0e0e0;
      overflow-y: auto;
      padding: 24px;
    }

    .info-section {
      margin-bottom: 24px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .info-section h2 {
      margin: 0 0 12px 0;
      font-size: 20px;
      color: #333;
    }

    .info-section h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #555;
    }

    .info-section p {
      margin: 0 0 12px 0;
      line-height: 1.6;
      color: #666;
    }

    .info-section ul {
      margin: 0;
      padding-left: 20px;
    }

    .info-section li {
      margin: 8px 0;
      line-height: 1.5;
      color: #666;
    }

    .info-section li strong {
      color: #667eea;
    }

    .graph-selector {
      width: 100%;
      padding: 10px;
      margin-bottom: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      background: white;
      font-size: 14px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .graph-selector:hover {
      border-color: #667eea;
    }

    .graph-selector:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .graph-title {
      margin: 12px 0 8px 0;
      font-size: 15px;
      font-weight: 600;
      color: #667eea;
    }

    .stats {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }

    .stat {
      flex: 1;
      background: #f0f4ff;
      padding: 16px;
      border-radius: 6px;
      text-align: center;
    }

    .stat strong {
      display: block;
      font-size: 28px;
      color: #667eea;
      margin-bottom: 4px;
    }

    .stat span {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .loading {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 20px 0;
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      font-size: 18px;
      color: #999;
    }

    .highlight {
      background: linear-gradient(135deg, #fff9e6 0%, #fff4d5 100%);
      border-left: 4px solid #ffc107;
    }

    .tech-note {
      font-size: 13px;
      font-style: italic;
      color: #777;
      margin-top: 12px;
    }

    .graph-container {
      flex: 1;
      display: flex;
      position: relative;
      background: white;
    }

    .graph-wrapper {
      flex: 1;
      display: flex;
      position: relative;
    }

    cyng-cytoscape-graph {
      flex: 1;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      margin: 16px;
    }

    .graph-toolbar {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 320px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }

    /* Global styles for Material menu - these affect the dropdown panel */
    ::ng-deep .mat-mdc-menu-panel {
      max-width: 380px !important;
      min-width: 360px !important;
      font-size: 13px !important;
    }

    ::ng-deep .mat-mdc-menu-content {
      padding: 8px !important;
    }

    /* Compact Material form fields */
    ::ng-deep .mat-mdc-form-field {
      font-size: 13px !important;
      margin-bottom: 6px !important;
    }

    /* Hide the description in mat-select trigger (when closed) */
    ::ng-deep .mat-mdc-select-value .description {
      display: none !important;
    }

    /* Hide mat-hint below mat-select */
    ::ng-deep .mat-mdc-form-field-hint-wrapper,
    ::ng-deep .mat-mdc-form-field-bottom-align {
      display: none !important;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      padding-bottom: 0 !important;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none !important;
    }

    ::ng-deep .mat-mdc-form-field-infix {
      padding-top: 6px !important;
      padding-bottom: 6px !important;
      min-height: 28px !important;
    }

    /* Compact expansion panels */
    ::ng-deep .mat-expansion-panel {
      margin: 4px 0 !important;
      background-color: white !important;
      box-shadow: 0 1px 3px rgba(102, 126, 234, 0.1) !important;
    }

    ::ng-deep .mat-expansion-panel-header {
      padding: 0 16px !important;
      height: 36px !important;
      font-size: 13px !important;
      font-weight: 600 !important;
    }

    ::ng-deep .mat-expansion-panel-body {
      padding: 0 16px 8px !important;
    }

    ::ng-deep .mat-expansion-panel-content {
      background-color: white !important;
    }

    /* Remove the gap between header and body */
    ::ng-deep .mat-expansion-panel-body {
      margin-top: -12px !important;
      padding-top: 0 !important;
    }

    /* Target the first form field in expansion panel body */
    ::ng-deep .mat-expansion-panel-body > * {
      margin-top: 0 !important;
    }

    ::ng-deep .mat-expansion-panel-body .mat-mdc-form-field:first-child {
      margin-top: 0 !important;
    }

    /* Compact slide toggles */
    ::ng-deep .mat-mdc-slide-toggle {
      margin: 6px 0 !important;
      font-size: 13px !important;
    }

    ::ng-deep .mat-mdc-slide-toggle-label {
      font-size: 13px !important;
    }

    .app-footer {
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      padding: 16px 32px;
      text-align: center;
    }

    .app-footer p {
      margin: 4px 0;
      font-size: 13px;
      color: #666;
    }

    .app-footer a {
      color: #667eea;
      text-decoration: none;
      margin: 0 8px;
    }

    .app-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 1024px) {
      .content-layout {
        flex-direction: column;
      }

      .info-panel {
        width: 100%;
        max-height: 300px;
      }

      .graph-toolbar {
        position: static;
        margin: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
    }
  `]
})
export class AppComponent {
  private readonly http = inject(HttpClient);

  // Graph reference
  private readonly graph = viewChild<CytoscapeGraphComponent>('graph');

  // Available graphs
  readonly availableGraphs = AVAILABLE_GRAPHS;
  readonly selectedGraph = signal<GraphMetadata>(AVAILABLE_GRAPHS[0]);

  // Graph data
  readonly nodes = signal<NodeDefinition[]>([]);
  readonly edges = signal<EdgeDefinition[]>([]);
  readonly stylesheet = signal<StylesheetStyle[]>([]);
  readonly layoutOptions = signal<LayoutOptions>(new CoseLayoutOptions() as LayoutOptions);

  constructor() {
    // Register dagre layout
    cytoscape.use(dagre);

    // Load default graph
    this.loadGraphData(this.selectedGraph().id);
  }

  /**
   * Loads graph data from .cyjs files
   */
  private async loadGraphData(graphId: string): Promise<void> {
    try {
      const metadata = this.availableGraphs.find(g => g.id === graphId);
      if (!metadata) {
        throw new Error(`Graph not found: ${graphId}`);
      }

      // Load graph data
      const graphData = await firstValueFrom(
        this.http.get<GraphData>(`${graphId}.cyjs`)
      );

      // Load stylesheet if available
      if (metadata.hasStylesheet) {
        const stylesheetData = await firstValueFrom(
          this.http.get<StylesheetData>(`${graphId}.json`)
        );
        this.stylesheet.set(stylesheetData.style);
      } else {
        // Use default stylesheet
        this.setDefaultStylesheet();
      }

      // Process nodes and edges
      this.processGraphData(graphData);

      console.log(`Loaded ${graphData.elements.nodes.length} nodes and ${graphData.elements.edges.length} edges for ${metadata.name}`);
    } catch (error) {
      console.error('Failed to load graph data:', error);
      // Fall back to sample data if loading fails
      this.loadSampleData();
    }
  }

  /**
   * Process graph data to ensure proper format for cytoscape-angular
   */
  private processGraphData(data: GraphData): void {
    // Stamp node groups and remove problematic fields
    const nodes = data.elements.nodes.map(node => ({
      ...node,
      group: 'nodes' as const
    }));

    const edges = data.elements.edges.map(edge => {
      const processedEdge = {
        ...edge,
        group: 'edges' as const
      };

      // Remove curve-style field that can cause issues
      if (processedEdge.data && 'curve-style' in processedEdge.data) {
        delete (processedEdge.data as any)['curve-style'];
      }

      return processedEdge;
    });

    this.nodes.set(nodes);
    this.edges.set(edges);
  }

  /**
   * Fallback sample data if .cyjs files are not available
   */
  private loadSampleData(): void {
    console.warn('Using fallback sample data');

    const sampleNodes: NodeDefinition[] = [
      { data: { id: 'TGFB1', label: 'TGF-β1', type: 'ligand' } },
      { data: { id: 'TGFBR1', label: 'TGF-β R1', type: 'receptor' } },
      { data: { id: 'TGFBR2', label: 'TGF-β R2', type: 'receptor' } },
      { data: { id: 'SMAD2', label: 'SMAD2', type: 'protein' } },
      { data: { id: 'SMAD3', label: 'SMAD3', type: 'protein' } },
      { data: { id: 'SMAD4', label: 'SMAD4', type: 'protein' } },
      { data: { id: 'SMAD7', label: 'SMAD7', type: 'inhibitor' } },
      { data: { id: 'SKI', label: 'SKI', type: 'inhibitor' } },
      { data: { id: 'SMURF1', label: 'SMURF1', type: 'enzyme' } },
      { data: { id: 'MAPK1', label: 'ERK', type: 'kinase' } },
      { data: { id: 'JUN', label: 'c-Jun', type: 'transcription' } },
      { data: { id: 'FOS', label: 'c-Fos', type: 'transcription' } }
    ];

    const sampleEdges: EdgeDefinition[] = [
      { data: { id: 'e1', source: 'TGFB1', target: 'TGFBR2' } },
      { data: { id: 'e2', source: 'TGFBR2', target: 'TGFBR1' } },
      { data: { id: 'e3', source: 'TGFBR1', target: 'SMAD2' } },
      { data: { id: 'e4', source: 'TGFBR1', target: 'SMAD3' } },
      { data: { id: 'e5', source: 'SMAD2', target: 'SMAD4' } },
      { data: { id: 'e6', source: 'SMAD3', target: 'SMAD4' } },
      { data: { id: 'e7', source: 'SMAD7', target: 'TGFBR1', arrowType: 'inhibition' } },
      { data: { id: 'e8', source: 'SKI', target: 'SMAD4', arrowType: 'inhibition' } },
      { data: { id: 'e9', source: 'SMAD7', target: 'SMURF1' } },
      { data: { id: 'e10', source: 'SMURF1', target: 'TGFBR1', arrowType: 'degradation' } },
      { data: { id: 'e11', source: 'TGFBR1', target: 'MAPK1' } },
      { data: { id: 'e12', source: 'MAPK1', target: 'JUN' } },
      { data: { id: 'e13', source: 'MAPK1', target: 'FOS' } }
    ];

    const sampleStylesheet: StylesheetStyle[] = [
      {
        selector: 'node',
        style: {
          'background-color': '#4A90E2',
          'label': 'data(label)',
          'color': '#000',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '12px',
          'font-weight': 'bold',
          'width': 50,
          'height': 50,
          'border-width': 2,
          'border-color': '#2E5C8A'
        }
      },
      {
        selector: 'node[type="ligand"]',
        style: {
          'background-color': '#FF6B6B',
          'shape': 'diamond'
        }
      },
      {
        selector: 'node[type="receptor"]',
        style: {
          'background-color': '#4ECDC4',
          'shape': 'roundrectangle'
        }
      },
      {
        selector: 'node[type="protein"]',
        style: {
          'background-color': '#95E1D3',
          'shape': 'ellipse'
        }
      },
      {
        selector: 'node[type="inhibitor"]',
        style: {
          'background-color': '#FFA07A',
          'shape': 'hexagon'
        }
      },
      {
        selector: 'node[type="enzyme"]',
        style: {
          'background-color': '#DDA15E',
          'shape': 'triangle'
        }
      },
      {
        selector: 'node[type="kinase"]',
        style: {
          'background-color': '#BC6C25',
          'shape': 'rectangle'
        }
      },
      {
        selector: 'node[type="transcription"]',
        style: {
          'background-color': '#B284BE',
          'shape': 'star'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#999',
          'target-arrow-color': '#999',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      },
      {
        selector: 'edge[arrowType="inhibition"]',
        style: {
          'line-color': '#E74C3C',
          'target-arrow-color': '#E74C3C',
          'target-arrow-shape': 'tee',
          'line-style': 'dashed'
        }
      },
      {
        selector: 'edge[arrowType="degradation"]',
        style: {
          'line-color': '#E67E22',
          'target-arrow-color': '#E67E22',
          'target-arrow-shape': 'circle'
        }
      },
      {
        selector: ':selected',
        style: {
          'background-color': '#FFC107',
          'line-color': '#FFC107',
          'target-arrow-color': '#FFC107',
          'border-color': '#FF9800',
          'border-width': 4
        }
      }
    ];

    this.nodes.set(sampleNodes);
    this.edges.set(sampleEdges);
    this.stylesheet.set(sampleStylesheet);
  }

  /**
   * Handle graph selection change
   */
  protected onGraphSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const graphId = select.value;
    const metadata = this.availableGraphs.find(g => g.id === graphId);

    if (metadata) {
      this.selectedGraph.set(metadata);
      this.loadGraphData(graphId);
    }
  }

  /**
   * Set default stylesheet for graphs without custom styles
   */
  private setDefaultStylesheet(): void {
    const defaultStylesheet: StylesheetStyle[] = [
      {
        selector: 'node',
        style: {
          'background-color': '#4A90E2',
          'label': 'data(label)',
          'color': '#000',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '10px',
          'width': 40,
          'height': 40
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#999',
          'target-arrow-color': '#999',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ];
    this.stylesheet.set(defaultStylesheet);
  }

  protected onGraphReady(cy: Core): void {
    console.log('Graph ready with', cy.nodes().length, 'nodes');
  }

  protected onSelectorChange(selector: string): void {
    const graphComponent = this.graph();
    if (graphComponent) {
      graphComponent.zoomToElement(selector);
    }
  }
}

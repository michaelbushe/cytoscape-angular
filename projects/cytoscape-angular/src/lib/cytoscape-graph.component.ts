import {
  Component,
  ElementRef,
  input,
  viewChild,
  effect,
  signal,
  computed,
  DestroyRef,
  inject,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type {
  Core,
  CytoscapeOptions,
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
  Position,
  SelectionType,
  StylesheetStyle
} from 'cytoscape';
import cytoscape from 'cytoscape';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Cytoscape Graph Component
 *
 * A 20 component for rendering interactive Cytoscape graphs.
 * Features:
 * - Standalone component architecture
 * - Reactive signals for state management
 * - Proper memory management with DestroyRef
 * - Full TypeScript typing
 * - Comprehensive API for cytoscape.js integration
 *
 * @example
 * ```html
 * <cyng-cytoscape-graph
 *   [nodes]="graphNodes"
 *   [edges]="graphEdges"
 *   [style]="graphStyle"
 *   [layoutOptions]="layout"
 *   (graphReady)="onGraphReady($event)"
 * />
 * ```
 */
@Component({
  selector: 'cyng-cytoscape-graph',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    @if (loading()) {
      <mat-spinner class="spinner" diameter="80" />
    }
    <div #cyGraph class="graph-wrapper">
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      height: 100%;
      width: 100%;
    }

    .spinner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    }

    .graph-wrapper {
      height: 100%;
      width: 100%;
    }
  `]
})
export class CytoscapeGraphComponent {
  private readonly destroyRef = inject(DestroyRef);

  // View child - modern Angular 20 signal-based query
  private readonly cyGraphElement = viewChild.required<ElementRef<HTMLDivElement>>('cyGraph');

  // Inputs - using modern signal inputs
  readonly debug = input(false);
  readonly nodes = input<NodeDefinition[]>([]);
  readonly edges = input<EdgeDefinition[]>([]);
  readonly autolock = input<boolean | undefined>(undefined);
  readonly autoungrabify = input<boolean | undefined>(undefined);
  readonly autounselectify = input<boolean | undefined>(undefined);
  readonly boxSelectionEnabled = input(true);
  readonly desktopTapThreshold = input<number | undefined>(undefined);
  readonly hideEdgesOnViewport = input<boolean | undefined>(undefined);
  readonly hideLabelsOnViewport = input<boolean | undefined>(undefined);
  readonly layoutOptions = input<LayoutOptions | undefined>(undefined);
  readonly maxZoom = input<number | undefined>(undefined);
  readonly minZoom = input<number | undefined>(undefined);
  readonly motionBlur = input<boolean | undefined>(undefined);
  readonly motionBlurOpacity = input<number | undefined>(undefined);
  readonly pan = input<Position | undefined>(undefined);
  readonly panningEnabled = input(true);
  readonly pixelRatio = input<number | 'auto'>('auto');
  readonly selectionType = input<SelectionType | undefined>(undefined);
  readonly style = input<StylesheetStyle[]>([]);
  readonly styleEnabled = input(true);
  readonly textureOnViewport = input<boolean | undefined>(undefined);
  readonly touchTapThreshold = input<number | undefined>(undefined);
  readonly userPanningEnabled = input(true);
  readonly userZoomingEnabled = input(true);
  readonly wheelSensitivity = input<number | undefined>(undefined);
  readonly zoom = input(1);
  readonly zoomingEnabled = input(true);

  // Outputs
  readonly graphReady = output<Core>();
  readonly graphDestroyed = output<void>();

  // Internal signals
  protected readonly loading = signal(false);
  private readonly cy = signal<Core | null>(null);

  // Computed signal for cytoscape options
  private readonly cytoscapeOptions = computed((): CytoscapeOptions => {
    const container = this.cyGraphElement()?.nativeElement;
    if (!container) {
      throw new Error('Container element not found');
    }

    return {
      container,
      autolock: this.autolock(),
      autoungrabify: this.autoungrabify(),
      autounselectify: this.autounselectify(),
      boxSelectionEnabled: this.boxSelectionEnabled(),
      desktopTapThreshold: this.desktopTapThreshold(),
      hideEdgesOnViewport: this.hideEdgesOnViewport(),
      hideLabelsOnViewport: this.hideLabelsOnViewport(),
      layout: this.layoutOptions(),
      maxZoom: this.maxZoom(),
      minZoom: this.minZoom(),
      motionBlur: this.motionBlur(),
      motionBlurOpacity: this.motionBlurOpacity(),
      pan: this.pan(),
      panningEnabled: this.panningEnabled(),
      pixelRatio: this.pixelRatio(),
      selectionType: this.selectionType(),
      style: this.style(),
      styleEnabled: this.styleEnabled(),
      textureOnViewport: this.textureOnViewport(),
      touchTapThreshold: this.touchTapThreshold(),
      userPanningEnabled: this.userPanningEnabled(),
      userZoomingEnabled: this.userZoomingEnabled(),
      wheelSensitivity: this.wheelSensitivity(),
      zoomingEnabled: this.zoomingEnabled(),
      zoom: this.zoom(),
    };
  });

  constructor() {
    // Effect to initialize and update the graph when inputs change
    effect(() => {
      const nodes = this.nodes();
      const edges = this.edges();
      const layout = this.layoutOptions();
      const styles = this.style();

      // Trigger rerender when any of these change
      this.render();
    });

    // Effect to update styles independently for performance
    effect(() => {
      const styles = this.style();
      const cyInstance = this.cy();

      if (cyInstance && styles.length > 0) {
        cyInstance.style(styles);
      }
    });
  }

  /**
   * Center elements matching the selector
   */
  centerElements(selector: string): void {
    const cyInstance = this.cy();
    if (!cyInstance) {
      console.warn('Cytoscape instance not initialized');
      return;
    }

    const elements = cyInstance.$(selector);
    if (elements.length > 0) {
      cyInstance.center(elements);
    }
  }

  /**
   * Zoom to element matching the selector
   */
  zoomToElement(selector: string, level = 3): void {
    const cyInstance = this.cy();
    if (!cyInstance) {
      console.warn('Cytoscape instance not initialized');
      return;
    }

    const element = cyInstance.$(selector);
    const position = element.position();

    if (!position) {
      console.warn(`Cannot zoom to ${selector} - element not found`);
      return;
    }

    cyInstance.zoom({
      level,
      position
    });
    cyInstance.center(element);
  }

  /**
   * Get the cytoscape instance
   */
  getCytoscapeInstance(): Core | null {
    return this.cy();
  }

  /**
   * Manually trigger a render
   */
  render(): void {
    this.loading.set(true);

    // Use requestAnimationFrame for smoother rendering
    requestAnimationFrame(() => {
      this.performRender();

      // Reset loading state
      requestAnimationFrame(() => {
        this.loading.set(false);
      });
    });
  }

  private performRender(): void {
    const container = this.cyGraphElement()?.nativeElement;
    if (!container) {
      console.warn('Container element not available');
      return;
    }

    try {
      const options = this.cytoscapeOptions();

      // Destroy existing instance if present
      const existingInstance = this.cy();
      if (existingInstance) {
        existingInstance.destroy();
      }

      // Create new instance
      const newInstance = cytoscape(options);

      // Batch operations for performance
      newInstance.startBatch();

      // Clear existing elements
      newInstance.nodes().remove();
      newInstance.edges().remove();

      // Add new elements
      const nodes = this.nodes();
      const edges = this.edges();

      if (nodes.length > 0) {
        newInstance.add(nodes);
      }

      if (edges.length > 0) {
        newInstance.add(edges);
      }

      newInstance.endBatch();

      // Apply layout if specified
      const layout = this.layoutOptions();
      if (layout) {
        newInstance.layout(layout).run();
      }

      // Update signal
      this.cy.set(newInstance);

      // Emit ready event
      this.graphReady.emit(newInstance);

      if (this.debug()) {
        console.log('[CytoscapeGraph] Rendered successfully', {
          nodes: nodes.length,
          edges: edges.length,
          layout: layout?.name
        });
      }
    } catch (error) {
      console.error('[CytoscapeGraph] Render error:', error);
      this.loading.set(false);
    }
  }
}

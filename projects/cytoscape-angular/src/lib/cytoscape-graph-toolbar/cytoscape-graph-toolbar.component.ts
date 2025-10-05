import { Component, input, output, model, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { EdgeDefinition, LayoutOptions, NodeDefinition, StylesheetStyle } from 'cytoscape';
import cytoscape from 'cytoscape';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { CytoscapeLayoutToolComponent } from '../cytoscape-layout-tool/cytoscape-layout-tool.component';
import { CytoscapeStyleToolComponent } from '../cytoscape-style-tool/cytoscape-style-tool.component';

/**
 * Cytoscape Graph Toolbar Component
 * 
 * Provides a toolbar for controlling graph layout and styling options.
 * Features:
 * - Standalone component architecture
 * - Two-way binding with model signals
 * - Flexible row/column layout
 * - Material Design components
 * 
 * @example
 * ```html
 * <cyng-cytoscape-graph-toolbar
 *   [(layoutOptions)]="layoutOptions"
 *   [(styles)]="styles"
 *   [nodes]="nodes"
 *   [edges]="edges"
 *   [direction]="'row'"
 *   (layoutOptionsChange)="onLayoutChange($event)"
 *   (stylesChange)="onStylesChange($event)"
 *   (styleSelectorChange)="onSelectorChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'cyng-cytoscape-graph-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    CytoscapeLayoutToolComponent,
    CytoscapeStyleToolComponent
  ],
  template: `
    <div 
      class="toolbar-container"
      [class.row-layout]="direction() === 'row'"
      [class.column-layout]="direction() === 'column'">
      
      @if (showToolbarButtons()) {
        <button 
          mat-raised-button
          color="primary"
          [matMenuTriggerFor]="layoutMenu"
          matTooltip="Layout Settings"
          class="toolbar-button">
          <mat-icon>grid_view</mat-icon>
          {{ layoutButtonLabel() }}
        </button>
        
        <mat-menu #layoutMenu="matMenu">
          <div class="menu-content" (click)="$event.stopPropagation()">
            <cyng-cytoscape-layout-tool
              [(layoutOptions)]="layoutOptions"
            />
          </div>
        </mat-menu>

        <button 
          mat-raised-button
          color="primary"
          [matMenuTriggerFor]="styleMenu"
          matTooltip="Style Settings"
          class="toolbar-button">
          <mat-icon>palette</mat-icon>
          Style
        </button>
        
        <mat-menu #styleMenu="matMenu" class="wide-menu">
          <div class="menu-content" (click)="$event.stopPropagation()">
            <cyng-cytoscape-style-tool
              [(styles)]="styles"
              (styleSelectorChange)="onStyleSelectorChange($event)"
            />
          </div>
        </mat-menu>
      }
      
      @if (showStats()) {
        <div class="stats-container">
          @if (nodes(); as nodeCount) {
            <span class="stat" matTooltip="Number of nodes">
              <mat-icon class="stat-icon">circle</mat-icon>
              {{ nodeCount.length }} Nodes
            </span>
          }
          
          @if (edges(); as edgeCount) {
            <span class="stat" matTooltip="Number of edges">
              <mat-icon class="stat-icon">timeline</mat-icon>
              {{ edgeCount.length }} Edges
            </span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .toolbar-container {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 8px;
      background-color: #fafafa;
      border-radius: 4px;
    }

    .row-layout {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .column-layout {
      flex-direction: column;
      align-items: stretch;
    }

    .column-layout .toolbar-button {
      width: 100%;
    }

    .toolbar-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stats-container {
      display: flex;
      gap: 16px;
      margin-left: auto;
      color: rgba(0, 0, 0, 0.6);
    }

    .column-layout .stats-container {
      margin-left: 0;
      margin-top: 8px;
      flex-direction: column;
      gap: 8px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }

    .stat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
    }

    .menu-content {
      padding: 16px;
      min-width: 300px;
    }

    ::ng-deep .wide-menu .mat-mdc-menu-panel {
      min-width: 400px !important;
      max-width: 600px !important;
    }
  `]
})
export class CytoscapeGraphToolbarComponent {
  // Inputs
  readonly nodes = input<NodeDefinition[]>([]);
  readonly edges = input<EdgeDefinition[]>([]);
  readonly direction = input<'row' | 'column'>('row');
  readonly showToolbarButtons = input(true);
  readonly showStats = input(true);

  // Two-way bindings using model signals
  readonly layoutOptions = model<LayoutOptions>({ name: 'grid' });
  readonly styles = model<StylesheetStyle[]>([]);

  // Outputs
  readonly styleSelectorChange = output<string>();

  // Computed signals
  protected readonly layoutButtonLabel = computed(() => {
    const layout = this.layoutOptions();
    const name = layout?.name || 'grid';
    return name.charAt(0).toUpperCase() + name.slice(1);
  });

  protected onStyleSelectorChange(selector: string): void {
    this.styleSelectorChange.emit(selector);
  }
}

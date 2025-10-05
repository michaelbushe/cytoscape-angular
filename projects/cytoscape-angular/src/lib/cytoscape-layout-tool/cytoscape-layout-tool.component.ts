import { Component, model, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { LayoutOptions } from 'cytoscape';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FluidFormComponent } from '../fluid-form/fluid-form.component';
import { FormInfo } from '../fluid-form/form-info';
import { getFormInfoForLayout, createLayoutOptions } from '../layout/layout-options-impl';

interface LayoutOption {
  value: string;
  label: string;
  description: string;
}

/**
 * Cytoscape Layout Tool Component
 *
 * Provides a sophisticated interface for configuring Cytoscape layouts.
 * - Dynamic form generation based on selected layout type
 * - Type-safe configuration with FormInfo metadata
 * - Reactive signal-based state management
 *
 * The forms automatically adapt to show relevant options for each layout type,
 * making this an impressive showcase of Angular's capabilities.
 *
 * @example
 * ```html
 * <cyng-cytoscape-layout-tool
 *   [(layoutOptions)]="layoutOptions"
 * />
 * ```
 */
@Component({
  selector: 'cyng-cytoscape-layout-tool',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FluidFormComponent
  ],
  template: `
    <div class="layout-tool">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Layout Type</mat-label>
        <mat-select
          [(ngModel)]="selectedLayoutName"
          (ngModelChange)="onLayoutTypeChange($event)">
          <mat-select-trigger>
            {{ selectedLayoutLabel() }}
          </mat-select-trigger>
          @for (layout of availableLayouts(); track layout.value) {
            <mat-option [value]="layout.value">
              <strong>{{ layout.label }}</strong>
              <br>
              <small class="description">{{ layout.description }}</small>
            </mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-divider></mat-divider>

      <!-- Dynamic form that changes based on selected layout -->
      @if (currentFormInfo(); as formInfo) {
        <cyng-fluid-form
          [(model)]="layoutOptions"
          [formInfo]="formInfo"
        />
      }
    </div>
  `,
  styles: [`
    .layout-tool {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .description {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.85em;
      line-height: 1.3;
      display: block;
      margin-top: 4px;
    }

    mat-divider {
      margin: 8px 0;
    }
  `]
})
export class CytoscapeLayoutToolComponent {
  // Two-way binding using model signal
  readonly layoutOptions = model<LayoutOptions>({ name: 'grid' } as LayoutOptions);

  // Current layout type name
  protected readonly selectedLayoutName = signal<string>('grid');

  // Available layout types
  protected readonly availableLayouts = signal<LayoutOption[]>([
    {
      value: 'grid',
      label: 'Grid',
      description: 'Arranges nodes in a regular grid pattern with rows and columns'
    },
    {
      value: 'circle',
      label: 'Circle',
      description: 'Arranges nodes in a circular layout around a center point'
    },
    {
      value: 'concentric',
      label: 'Concentric',
      description: 'Arranges nodes in concentric circles based on hierarchy or degree'
    },
    {
      value: 'breadthfirst',
      label: 'Breadth-First',
      description: 'Hierarchical layout using breadth-first traversal of the graph'
    },
    {
      value: 'cose',
      label: 'CoSE (Force-Directed)',
      description: 'Physics-based force-directed layout for natural-looking graphs'
    },
    {
      value: 'dagre',
      label: 'Dagre (Hierarchical)',
      description: 'Sophisticated hierarchical layout for directed acyclic graphs'
    },
    {
      value: 'preset',
      label: 'Preset',
      description: 'Uses predefined node positions from the data'
    },
    {
      value: 'random',
      label: 'Random',
      description: 'Places nodes at random positions within the viewport'
    }
  ]);

  // Computed signal for selected layout description
  protected readonly selectedLayoutDescription = computed(() => {
    const layout = this.availableLayouts().find(l => l.value === this.selectedLayoutName());
    return layout?.description || '';
  });

  // Computed signal for selected layout label
  protected readonly selectedLayoutLabel = computed(() => {
    const layout = this.availableLayouts().find(l => l.value === this.selectedLayoutName());
    return layout?.label || '';
  });

  // Computed signal for the dynamic form configuration
  // This is the magic - the form changes based on layout type!
  protected readonly currentFormInfo = computed((): FormInfo => {
    const layoutName = this.layoutOptions().name || 'grid';
    return getFormInfoForLayout(layoutName);
  });

  constructor() {
    // Initialize from current layoutOptions
    const current = this.layoutOptions();
    if (current.name) {
      this.selectedLayoutName.set(current.name);
    }
  }

  /**
   * Handles layout type changes
   * Creates a new layout instance with default values for the selected type
   */
  protected onLayoutTypeChange(layoutName: string): void {
    this.selectedLayoutName.set(layoutName);

    // Create new layout options with defaults for this type
    const newOptions = createLayoutOptions(layoutName) as LayoutOptions;

    // Preserve common options from current layout
    const currentOptions = this.layoutOptions() as any;
    const newOpts = newOptions as any;
    if ('fit' in currentOptions && currentOptions.fit !== undefined) newOpts.fit = currentOptions.fit;
    if ('padding' in currentOptions && currentOptions.padding !== undefined) newOpts.padding = currentOptions.padding;
    if ('animate' in currentOptions && currentOptions.animate !== undefined) newOpts.animate = currentOptions.animate;
    if ('animationDuration' in currentOptions && currentOptions.animationDuration !== undefined) {
      newOpts.animationDuration = currentOptions.animationDuration;
    }

    this.layoutOptions.set(newOptions);
  }
}

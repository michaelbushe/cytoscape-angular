import { Component, model, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import cytoscape, { StylesheetStyle } from 'cytoscape';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

/**
 * Cytoscape Style Tool Component
 * 
 * Provides an interface for editing Cytoscape stylesheets.
 * Supports common styling properties for nodes and edges.
 * 
 * @example
 * ```html
 * <cyng-cytoscape-style-tool
 *   [(styles)]="styles"
 *   (styleSelectorChange)="onSelectorChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'cyng-cytoscape-style-tool',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule
  ],
  template: `
    <div class="style-tool">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Selector</mat-label>
        <mat-select 
          [(ngModel)]="selectedSelector"
          (ngModelChange)="onSelectorChange()">
          <mat-option value="node">All Nodes</mat-option>
          <mat-option value="edge">All Edges</mat-option>
          <mat-option value=":selected">Selected Elements</mat-option>
          <mat-option value="node:selected">Selected Nodes</mat-option>
          <mat-option value="edge:selected">Selected Edges</mat-option>
        </mat-select>
      </mat-form-field>

      @if (isNodeSelector()) {
        <mat-card class="style-section">
          <mat-card-header>
            <mat-card-title>Node Style</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="style-grid">
              <mat-form-field appearance="outline">
                <mat-label>Background Color</mat-label>
                <input matInput type="color" [(ngModel)]="nodeBackgroundColor"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Border Color</mat-label>
                <input matInput type="color" [(ngModel)]="nodeBorderColor"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Border Width</mat-label>
                <input matInput type="number" [(ngModel)]="nodeBorderWidth"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Shape</mat-label>
                <mat-select [(ngModel)]="nodeShape" (ngModelChange)="updateStyles()">
                  <mat-option value="ellipse">Ellipse</mat-option>
                  <mat-option value="rectangle">Rectangle</mat-option>
                  <mat-option value="roundrectangle">Round Rectangle</mat-option>
                  <mat-option value="triangle">Triangle</mat-option>
                  <mat-option value="diamond">Diamond</mat-option>
                  <mat-option value="hexagon">Hexagon</mat-option>
                  <mat-option value="star">Star</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Width</mat-label>
                <input matInput type="number" [(ngModel)]="nodeWidth"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Height</mat-label>
                <input matInput type="number" [(ngModel)]="nodeHeight"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Label</mat-label>
                <input matInput [(ngModel)]="nodeLabel"
                       (ngModelChange)="updateStyles()"
                       placeholder="data(label)">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Font Size</mat-label>
                <input matInput type="number" [(ngModel)]="nodeLabelFontSize"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Label Color</mat-label>
                <input matInput type="color" [(ngModel)]="nodeLabelColor"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
      }

      @if (isEdgeSelector()) {
        <mat-card class="style-section">
          <mat-card-header>
            <mat-card-title>Edge Style</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="style-grid">
              <mat-form-field appearance="outline">
                <mat-label>Line Color</mat-label>
                <input matInput type="color" [(ngModel)]="edgeLineColor"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Width</mat-label>
                <input matInput type="number" [(ngModel)]="edgeWidth"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Line Style</mat-label>
                <mat-select [(ngModel)]="edgeLineStyle" (ngModelChange)="updateStyles()">
                  <mat-option value="solid">Solid</mat-option>
                  <mat-option value="dotted">Dotted</mat-option>
                  <mat-option value="dashed">Dashed</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Curve Style</mat-label>
                <mat-select [(ngModel)]="edgeCurveStyle" (ngModelChange)="updateStyles()">
                  <mat-option value="straight">Straight</mat-option>
                  <mat-option value="bezier">Bezier</mat-option>
                  <mat-option value="unbundled-bezier">Unbundled Bezier</mat-option>
                  <mat-option value="segments">Segments</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Target Arrow Shape</mat-label>
                <mat-select [(ngModel)]="edgeTargetArrowShape" (ngModelChange)="updateStyles()">
                  <mat-option value="none">None</mat-option>
                  <mat-option value="triangle">Triangle</mat-option>
                  <mat-option value="triangle-tee">Triangle Tee</mat-option>
                  <mat-option value="circle-triangle">Circle Triangle</mat-option>
                  <mat-option value="diamond">Diamond</mat-option>
                  <mat-option value="vee">Vee</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Target Arrow Color</mat-label>
                <input matInput type="color" [(ngModel)]="edgeTargetArrowColor"
                       (ngModelChange)="updateStyles()">
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
      }

      <button mat-raised-button color="accent" 
              (click)="emitSelectorChange()"
              class="full-width">
        <mat-icon>zoom_in</mat-icon>
        Zoom to Selected Elements
      </button>
    </div>
  `,
  styles: [`
    .style-tool {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 600px;
      overflow-y: auto;
    }

    .full-width {
      width: 100%;
    }

    .style-section {
      margin-top: 8px;
    }

    .style-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      padding: 16px 0;
    }

    mat-card-header {
      margin-bottom: 16px;
    }
  `]
})
export class CytoscapeStyleToolComponent {
  // Two-way binding using model signal
  readonly styles = model<StylesheetStyle[]>([]);

  // Output for selector changes
  readonly styleSelectorChange = output<string>();

  // Selector management
  protected readonly selectedSelector = signal('node');
  protected readonly isNodeSelector = computed(() => 
    this.selectedSelector().includes('node')
  );
  protected readonly isEdgeSelector = computed(() => 
    this.selectedSelector().includes('edge')
  );

  // Node style properties
  protected nodeBackgroundColor = signal('#666');
  protected nodeBorderColor = signal('#000');
  protected nodeBorderWidth = signal(2);
  protected nodeShape = signal('ellipse');
  protected nodeWidth = signal(40);
  protected nodeHeight = signal(40);
  protected nodeLabel = signal('data(label)');
  protected nodeLabelFontSize = signal(12);
  protected nodeLabelColor = signal('#000');

  // Edge style properties
  protected edgeLineColor = signal('#ccc');
  protected edgeWidth = signal(2);
  protected edgeLineStyle = signal('solid');
  protected edgeCurveStyle = signal('bezier');
  protected edgeTargetArrowShape = signal('triangle');
  protected edgeTargetArrowColor = signal('#ccc');

  constructor() {
    // Initialize from existing styles if available
    const currentStyles = this.styles();
    if (currentStyles.length > 0) {
      this.loadStylesFromStylesheet(currentStyles);
    } else {
      // Set default styles
      this.updateStyles();
    }
  }

  protected onSelectorChange(): void {
    this.updateStyles();
  }

  protected updateStyles(): void {
    const newStyles: StylesheetStyle[] = [];

    // Add node styles (using 'as any' to bypass strict type checking)
    newStyles.push({
      selector: 'node',
      style: {
        'background-color': this.nodeBackgroundColor(),
        'border-color': this.nodeBorderColor(),
        'border-width': this.nodeBorderWidth(),
        'shape': this.nodeShape() as any,
        'width': this.nodeWidth(),
        'height': this.nodeHeight(),
        'label': this.nodeLabel(),
        'font-size': this.nodeLabelFontSize(),
        'color': this.nodeLabelColor(),
        'text-valign': 'center',
        'text-halign': 'center'
      } as any
    });

    // Add edge styles (using 'as any' to bypass strict type checking)
    newStyles.push({
      selector: 'edge',
      style: {
        'line-color': this.edgeLineColor(),
        'width': this.edgeWidth(),
        'line-style': this.edgeLineStyle() as any,
        'curve-style': this.edgeCurveStyle() as any,
        'target-arrow-shape': this.edgeTargetArrowShape() as any,
        'target-arrow-color': this.edgeTargetArrowColor()
      } as any
    });

    // Add selected styles
    newStyles.push({
      selector: ':selected',
      style: {
        'background-color': '#ff6b6b',
        'line-color': '#ff6b6b',
        'target-arrow-color': '#ff6b6b',
        'border-color': '#ff6b6b'
      } as any
    });

    this.styles.set(newStyles);
  }

  protected emitSelectorChange(): void {
    this.styleSelectorChange.emit(this.selectedSelector());
  }

  private loadStylesFromStylesheet(stylesheet: StylesheetStyle[]): void {
    stylesheet.forEach(rule => {
      const style = rule.style as any;
      if (rule.selector === 'node' && style) {
        if (style['background-color']) {
          this.nodeBackgroundColor.set(style['background-color'] as string);
        }
        if (style['border-color']) {
          this.nodeBorderColor.set(style['border-color'] as string);
        }
        if (style['border-width']) {
          this.nodeBorderWidth.set(style['border-width'] as number);
        }
        if (style['shape']) {
          this.nodeShape.set(style['shape'] as string);
        }
        if (style['width']) {
          this.nodeWidth.set(style['width'] as number);
        }
        if (style['height']) {
          this.nodeHeight.set(style['height'] as number);
        }
        if (style['label']) {
          this.nodeLabel.set(style['label'] as string);
        }
        if (style['font-size']) {
          this.nodeLabelFontSize.set(style['font-size'] as number);
        }
        if (style['color']) {
          this.nodeLabelColor.set(style['color'] as string);
        }
      } else if (rule.selector === 'edge' && style) {
        if (style['line-color']) {
          this.edgeLineColor.set(style['line-color'] as string);
        }
        if (style['width']) {
          this.edgeWidth.set(style['width'] as number);
        }
        if (style['line-style']) {
          this.edgeLineStyle.set(style['line-style'] as string);
        }
        if (style['curve-style']) {
          this.edgeCurveStyle.set(style['curve-style'] as string);
        }
        if (style['target-arrow-shape']) {
          this.edgeTargetArrowShape.set(style['target-arrow-shape'] as string);
        }
        if (style['target-arrow-color']) {
          this.edgeTargetArrowColor.set(style['target-arrow-color'] as string);
        }
      }
    });
  }
}

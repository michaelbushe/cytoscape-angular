import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { EdgeDefinition, LayoutOptions, NodeDefinition, Stylesheet } from 'cytoscape'
@Component({
  selector: 'cytoscape-graph-toolbar',
  template: `
    <div class="toolbar-container"
         [class.row-layout]="direction === 'row'"
         [class.column-layout]="direction === 'column'">
      <p-overlayPanel #layoutToolbaroverlay
                      [dismissable]="true" [showCloseIcon]="true"
      >
        <ng-template pTemplate>
          <cytoscape-layout-tool [(layoutOptions)]="layoutOptions"></cytoscape-layout-tool>
        </ng-template>
      </p-overlayPanel>
      <p-button *ngIf="showToolbarButtons"
                label="{{layoutOptions.name | titlecase }} Layout"
                [class.max-button-width]="direction === 'column'"
                pTooltip="Layout Settings..."
                icon="pi pi-sliders-v"
                (click)="layoutToolbaroverlay.toggle($event)"></p-button>
      <p-overlayPanel #styleToolbaroverlay [dismissable]="true" [showCloseIcon]="true">
        <ng-template pTemplate>
          <cytoscape-style-tool
            [(styles)]="styles"
            (stylesChange)="onStylesChange($event)"
            (styleSelectorChange)="onStyleSelectorChange($event)"></cytoscape-style-tool>
        </ng-template>
      </p-overlayPanel>
      <p-button *ngIf="showToolbarButtons"
                [class.max-button-width]="direction === 'column'"
                label="Style"
                pTooltip="Styling..."
                icon="pi pi-palette"
                (click)="styleToolbaroverlay.toggle($event)">
      </p-button>
      <span class="graph-data" *ngIf="nodes">{{nodes.length}} Nodes &nbsp;</span>
      <span class="graph-data" *ngIf="edges">{{edges.length}} Edges</span>
    </div>
  `,
  styles: [
     `
      .toolbar-container {
        display: flex;
      }

      .row-layout {
        flex-direction: row;
        align-items: center;
        padding-bottom: 4px;
      }

      .column-layout {
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        padding-left: 4px;
      }

      p-button {
        padding-bottom: 4px;
        padding-right: 4px;
      }
    `
  ],
})
export class CytoscapeGraphToolbarComponent implements OnInit {
  @Input()
  nodes: NodeDefinition[]
  @Input()
  edges: EdgeDefinition[]
  @Input()
  direction: 'column' | 'row' = 'row'

  _layoutOptions: LayoutOptions
  @Input()
  get layoutOptions(): LayoutOptions {
    return this._layoutOptions;
  }
  set layoutOptions(value) {
    console.log(`Graph toolbar gets new layout options ${JSON.stringify(value)}`)
    this._layoutOptions = value;
    this.layoutOptionsChange.emit(this._layoutOptions);
  }
  @Output() layoutOptionsChange: EventEmitter<LayoutOptions> = new EventEmitter<LayoutOptions>();

  _styles: Stylesheet[]
  @Input()
  get styles(): Stylesheet[] {
    return this._styles;
  }
  set styles(styles: Stylesheet[]) {
    this._styles = styles;
    this.stylesChange.emit(this._styles);
  }
  @Output() stylesChange: EventEmitter<Stylesheet[]> = new EventEmitter<Stylesheet[]>();

  @Output() styleSelectorChange: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  showLayoutToolbarButton: boolean
  @Input()
  showStyleToolbarButton: boolean
  @Input()
  showToolbarButtons: boolean

  constructor() {
  }

  ngOnInit(): void {
  }

  onStyleSelectorChange(selector: string) {
    console.log(`onStyleSelectorChange: selector`)
    this.styleSelectorChange.emit(selector)
  }

  onStylesChange(stylesheet: cytoscape.StylesheetStyle[]) {
    console.log(`onStylesChange`)
    this.styles = stylesheet
  }
}

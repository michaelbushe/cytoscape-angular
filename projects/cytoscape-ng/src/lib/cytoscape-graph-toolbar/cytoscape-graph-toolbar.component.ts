import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { LayoutOptions, Stylesheet } from 'cytoscape'
@Component({
  selector: 'cytoscape-graph-toolbar',
  template: `
    <div>
      <div class="layoutTool" *ngIf="showToolbarButtons">
        <p-overlayPanel #layoutToolbaroverlay>
          <ng-template pTemplate>
            <cytoscape-layout-tool [(layoutOptions)]="layoutOptions"></cytoscape-layout-tool>
          </ng-template>
        </p-overlayPanel>
        <p-button *ngIf="showToolbarButtons" label="Layout" pTooltip="Layout settings..."
                  icon="pi pi-sliders-v" (click)="layoutToolbaroverlay.toggle($event)"></p-button>
        <p-overlayPanel #styleToolbaroverlay>
          <ng-template pTemplate>
            <cytoscape-style-tool [(styles)]="styles"></cytoscape-style-tool>
          </ng-template>
        </p-overlayPanel>
        <p-button *ngIf="showToolbarButtons" label="Style" pTooltip="Styling..."
                  icon="pi pi-palette"></p-button>
      </div>
    </div>
  `,
  styles: [
     `
      p-button {
        padding-left: 4px;
      }
    `
  ],
})
export class CytoscapeGraphToolbarComponent implements OnInit {

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

  _styles: Stylesheet
  @Input()
  get styles(): Stylesheet {
    return this._styles;
  }

  set styles(styles: Stylesheet) {
    this._styles = styles;
    this.stylesChange.emit(this._styles);
  }
  @Output() stylesChange: EventEmitter<Stylesheet> = new EventEmitter<Stylesheet>();

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
}

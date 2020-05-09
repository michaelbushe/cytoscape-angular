import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Stylesheet } from 'cytoscape'

@Component({
  selector: 'cytoscape-style-tool',
  template: `<div>Style Tools</div>`,
  styles: [``]
})
export class CytoscapeStyleToolComponent implements OnInit {
  _styles: Stylesheet
  @Input()
  get styles() : Stylesheet {
    return this._styles
  }
  set styles(styles: Stylesheet) {
    this.styles = styles
  }
  @Output()
  stylesChange:EventEmitter<Stylesheet> = new EventEmitter<Stylesheet>()

  constructor() { }

  ngOnInit(): void {
  }

}

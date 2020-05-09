import { Component, Input, OnInit } from '@angular/core'

/**
 * The forms for layout and style are generic and test the
 * layoutoption and style for the presence of the property,
 * lest it hides itself.
 */
@Component({
  selector: 'cyto-generic-input',
  template: `
    <div class="ui-g ui-fluid">
      <div class="ui-g-12 ui-md-4">
        <div class="ui-inputgroup">
          <span class="ui-chkbox-label">{{label}}</span>
          <p-inputSwitch
            [(ngModel)]="model[propName]"
            pTooltip="tooltip"
            [disabled]="!modelHasProperty(propName)">
          </p-inputSwitch>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .ui-chkbox-label {
        padding-right: 8px;
      }
    `
  ]
})
export class GenericInputComponentComponent implements OnInit {
  @Input()
  model: object
  @Input()
  propName: string
  @Input()
  tooltip: string
  @Input()
  label: string

  constructor() { }

  ngOnInit(): void {
  }

  modelHasProperty(field: string) {
//    console.log(`selectedLayoutHasProperty ${field}`)
    // tslint:disable-next-line:forin
    for (const prop in this.model) {
      // console.log(`prop: ${prop}`)
      if (prop === field) {
        //console.log(`true`)
        return true
      }
    }
    // console.log(`false`)
    return false
  }

}

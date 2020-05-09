import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'cyto-fluid-form-fieldset',
  template: `
    <p-fieldset class="fieldset" legend="Fit" *ngIf="modelHasProperty(modelProperty)">
      <div class="ui-g ui-fluid">
        <div class="ui-g-12 ui-md-4">
          <div class="ui-inputgroup">
            <span class="ui-chkbox-label">Fit</span>
            <p-inputSwitch [(ngModel)]="model[modelProperty]" pTooltip="whether to fit to viewport"
                           [disabled]="modelDoesntHaveProperty(modelProperty)"></p-inputSwitch>
          </div>
        </div>
<!--        <div class="ui-g-12 ui-md-4" *ngIf="modelHasProperty('padding')">-->
<!--          <div class="ui-inputgroup">-->
<!--            <span class="ui-chkbox-label">Padding</span>-->
<!--            <input type="number" pInputText placeholder="Padding" [(ngModel)]="layoutOptions.padding"-->
<!--                   pTooltip="padding around when fit"-->
<!--                   [disabled]="modelDoesntHaveProperty('padding')"/>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </p-fieldset>`,
  styles: []
})
export class FluidFormFieldsetComponent implements OnInit {
  @Input()
  model: any
  @Input()
  modelProperty: string

  constructor() { }

  ngOnInit(): void {
  }

  modelHasProperty(field: string): boolean {
    return true
    // if (!this.model) {
    //   return false //not sure why this happens ever
    // }
    // // if (field === 'fit') {
    // //   console.log(`this._layoutOptions: ${JSON.stringify(this.selectedLayoutInfo)}`)
    // // }
    // // tslint:disable-next-line:forin
    // for (const prop in this.model) {
    //   // console.log(`prop: ${prop}`)
    //   if (prop === field) {
    //     // console.log(`selected layout has ${field}`)
    //     return true
    //   }
    // }
    // // console.log(`selected layout has no ${field}`)
    // return false
  }

  modelDoesntHaveProperty(field: string) {
    return !this.modelHasProperty(field)
  }

}

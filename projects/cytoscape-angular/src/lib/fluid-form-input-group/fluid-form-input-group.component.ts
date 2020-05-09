import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cyto-fluid-form-input-group',
  template: `
      <div class="ui-g-12 ui-md-4">
        <div class="ui-inputgroup">
          <ng-content></ng-content>
        </div>
      </div>
    `,
  styles: [`
  `],
  host: {'class': 'ui-g ui-fluid'}
})
export class FluidFormInputGroupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

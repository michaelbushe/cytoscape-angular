import {
  AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core'
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn } from '@angular/forms'
import { FormInfo } from './FormInfo'

@Component({
  selector: 'cyng-fluid-form',
  template: `
    <form [formGroup]="formGroup" [title]="formInfo?.title" (ngSubmit)="onSubmit()">
      <ng-container *ngFor="let fieldSetInfo of formInfo?.fieldsets">
        <p-fieldset *ngIf="fieldSetInfo.showFieldsetForModel(model)" class="fieldset" legend="{{fieldSetInfo.legend}}">
          <div class="ui-g ui-fluid">
            <div class="ui-g-12 ui-md-4 field" *ngFor="let fieldInfo of fieldSetInfo.fieldInfos">
              <div class="ui-inputgroup">
                <ng-container *ngIf="fieldInfo.fieldType(model) === 'boolean'">
                  <span class="ui-chkbox-label">
                    {{fieldInfo.label}}
                  </span>
                  <p-inputSwitch
                    name="{{fieldInfo.modelProperty}}"
                    pTooltip="{{fieldInfo.tooltip}}"
                    formControlName="{{fieldInfo.modelProperty}}"
                  >
                  </p-inputSwitch>
                </ng-container>
                <ng-container
                  *ngIf="fieldInfo.fieldType(model) === 'string' || fieldInfo.fieldType(model) === 'number'">
                  <span class="ui-float-label">
                    <input pInputText
                           id="{{fieldInfo.modelProperty}}"
                           name="{{fieldInfo.modelProperty}}"
                           formControlName="{{fieldInfo.modelProperty}}"
                           [pTooltip]="fieldInfo.tooltip"
                           [type]="fieldInfo.inputType"
                           [size]="fieldInfo.inputSize"
                    />
                    <label for="{{fieldInfo.modelProperty}}">{{fieldInfo.label}}</label>
                  </span>
                </ng-container>
                <ng-container *ngIf="fieldInfo.fieldType(model) === 'options'">
                  <span class="ui-float-label">
                    <p-dropdown
                      formControlName="{{fieldInfo.modelProperty}}"
                      [name]="fieldInfo.modelProperty"
                      [options]="fieldInfo.options"
                      [optionLabel]="fieldInfo.optionArrayLabelField"
                      [pTooltip]="fieldInfo.tooltip"
                    ></p-dropdown>
                    <label for="{{fieldInfo.modelProperty}}">{{fieldInfo.label}}</label>
                  </span>
                </ng-container>
              </div>
            </div>
          </div>
        </p-fieldset>
      </ng-container>
    </form>
    <button *ngIf="formInfo.showSubmitButton" pButton
            [disabled]="formInfo.disableSubmitOnFormInvalid && !formGroup.valid"
            (submit)="onSubmit()">{{formInfo.submitText || 'Submit' }}</button>
  `,
  styles: [`
    .ui-chkbox-label {
      padding-right: 0.5em;
    }

    .ui-dropdown-label {
      align-self: center;
      padding-right: 0.5em
    }

    .field:nth-child(n+4) {
        margin-top: 1em; // otherwise overlap betwen a field and a floating label of the field below it
    }

    .fieldset {
    }
  `]
})
export class FluidFormComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  @Input()
  model: object
  @Output()
  modelChange: EventEmitter<object> = new EventEmitter<object>()

  @Input()
  modelProperty: string
  @Input()
  formInfo: FormInfo

  formGroup: FormGroup

  constructor() {
  }

  ngOnInit(): void {
    console.debug('FluidFormComponent this.formInfo:', JSON.stringify(this.formInfo))
    let controls = {}
    this.formInfo.fieldsets.forEach(fieldsetInfo => {
      fieldsetInfo.fieldInfos.forEach(fieldInfo => {
        let modelValue = this.model[fieldInfo.modelProperty]
        // console.log('fieldInfo.modelProperty:', fieldInfo.modelProperty, ', modelValue:', modelValue)
        const validators: ValidatorFn[] = typeof fieldInfo.validators === 'function' ? fieldInfo.validators() : fieldInfo.validators
        const asyncValidators: AsyncValidatorFn[] = typeof fieldInfo.asyncValidators === 'function' ? fieldInfo.asyncValidators() : fieldInfo.asyncValidators
        const { updateOn } = fieldInfo
        let formControl = new FormControl(modelValue, {validators, asyncValidators, updateOn })
        formControl.valueChanges.subscribe( (change) => {
          console.debug('form control change ', JSON.stringify(change), ' for prop ', fieldInfo.modelProperty,
            ', changing current model value ', this.model[fieldInfo.modelProperty], ' to ', change)
          fieldInfo.setValue(change, this.model, this.modelChange)
        })
        controls[fieldInfo.modelProperty] = formControl
      })
    })
    this.formGroup = new FormGroup(controls)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.debug('ngOnChanges fluid-form changes:', JSON.stringify(changes))
    if (changes['model']) {
      const model = changes['model'].currentValue
      for (let key of Object.keys(model)) {
        console.debug('ngOnChanges model key copying to form:', key)
        const control = this.formGroup?.controls[key]
        control ? control.setValue(model[key], { emitEvent: false }) : console.warn('no control for model key ', key)
      }
    }
  }

  ngAfterViewInit(): void {
    // console.debug("ngAfterViewInit")
  }

  ngAfterViewChecked(): void {
    // console.debug("ngAfterViewChecked")
  }

  onSubmit() {
    console.log(`Form submitted`)
  }
}

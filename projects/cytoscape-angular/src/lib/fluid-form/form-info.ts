/* tslint:disable:ban-types */
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms'
import { EventEmitter } from '@angular/core'

export type FieldType = 'ShapePolygonPoints' | 'percent' | 'NodeShape'| 'LineStyle' | 'TextTransformation' | 'FontStyle' | 'FontWeight' | 'options' | 'Colour' | 'undefined' | 'object' | 'boolean' | 'number' | 'string' | 'function' | 'symbol' | 'bigint'

export class FormInfo {
  constructor(public title: string,
              public fieldsets: FieldsetInfo[],
              public showSubmitButton = false,
              public submitText = 'Submit',
              public disableSubmitOnFormInvalid = false,
              /* if the model has a property that isn't in a fieldset, but it in an fieldset created by the form */
              public otherFieldsetTitle = null) {
  }
}

export class FieldsetInfo {
  constructor(public legend: string,
              public fieldInfos: FieldInfo[],
              public displayOnlyIfProperties?: string[]) {
  }

  showFieldsetForModel(model: object): boolean {
    if (!this.displayOnlyIfProperties) {
      return true
    }
    for (const fieldInfo of this.fieldInfos) {
      for (const modelProperty of Object.keys(model)) {
        if (fieldInfo.modelProperty === modelProperty) {
          return true
        }
      }
    }
    return false
  }
}

export class FieldInfo {
  private fieldTypes = {}
  updateOn: 'change' | 'blur' | 'submit' // same as AbstractControlOptions
  asyncValidators: AsyncValidatorFn[] | Function

  constructor(/* label to show the user next to the field, can be a function for i18n/dynamic labels */
              public label?: string | Function,
              /* The form has a model, this is the name of the property on the form's model object that this field */
              public modelProperty?: string,
              /* computed from the model property type by default */
              public type?: FieldType,
              /* The tooltip to display on hover */
              public tooltip?: string,
              /* The list of Angular Form Validators for the control or a function that returns such an array */
              public validators?: ValidatorFn[] | Function,
              /* disable the field if it's not valid */
              public disableWhenInvalid = false,
              /* If true and model[modelProperty] is undefined, don't create a field.*/
              public hideWhenNoModelProperty = true,
              /* Input only - by default the label is used as a placeholder and floats (how to downcast in a template?) */
              public placeholder?: string,
              /* Input only - same as HTML input (how to downcast in a template?) */
              public inputType: string = 'text',
              /* Input only - same as HTML input (how to downcast in a template?) */
              public inputSize: number = 8,
              /* Select only either an array of object or the name of a model property or function that is/returns an array of objects */
              public options?: object[] | string,
              /* In an options object, what field to display to the user (or function that returns a string
              given the option object and the model) */
              public optionArrayLabelField?: string | Function,
              /* In an options object, what field to return for the value of the option
              (or function that returns a string given the option object and the model) */
              public optionArrayValueField?: string | Function
  ) {
  }

  fieldType(model: object): FieldType {
    const cached = this.fieldTypes[this.modelProperty]
    if (cached) {
      return cached
    } else {
      const fieldValueType = typeof model[this.modelProperty]
      const result = this.type ? this.type : (this.options ? 'options' : fieldValueType)
      this.fieldTypes[this.modelProperty] = result
      return result
    }
  }

  setValue(newValue: any, model: object, modelChange: EventEmitter<any>) {
    model[this.modelProperty] = newValue
    modelChange.emit({property: this.modelProperty, value: newValue})
  }
}



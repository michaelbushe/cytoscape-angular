import { AsyncValidatorFn, ValidatorFn } from '@angular/forms'

type FieldType = 'undefined' | 'object' | 'boolean' | 'number' | 'string' | 'function' | 'symbol' | 'bigint' | 'options'

export class FormInfo {
  constructor(public title: string,
              public fieldsets: FieldsetInfo[],
              public showSubmitButton = true,
              public submitText = 'Submit',
              public disableSubmitOnFormInvalid = true,
              /* if the model has a property that isn't in a fieldset, but it in an fieldset created by the form */
              public otherFieldsetTitle = null) {
  }
}

export class FieldsetInfo {
  constructor(public legend: string,
              public fieldInfos: FieldInfo[],
              public displayOnlyIfProperties?: string[]) {
  }

  hasFieldsFor(model: object): boolean {
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
  private _fieldTypes = {}
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
              public inputSize: number = 15,
              /* Select only either an array of object or the name of a model property or function that is/returns an array of objects */
              public options?: object[] | string,
              /* In an options object, what field to display to the user (or function that returns a string given the option object and the model)? */
              public optionArrayLabelField?: string | Function,
              /* In an options object, what field to return for the value of the option (or function that returns a string given the option object and the model)? */
              public optionArrayValueField?: string | Function
  ) {
  }

  fieldType(model: object): FieldType {
    let cached = this._fieldTypes[this.modelProperty]
    if (cached) {
      return cached
    } else {
      let fieldValueType = typeof model[this.modelProperty]
      let result = this.type ? this.type : (this.options ? 'options': fieldValueType)
      // console.log(`fieldValueType: ${fieldValueType}, fieldType: ${result}, for this.modelProperty ${this.modelProperty}, value:${model[this.modelProperty]}, model: ${JSON.stringify(model)}`)
      this._fieldTypes[this.modelProperty] = result
      return result
    }
  }
}



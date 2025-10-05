import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { EventEmitter } from '@angular/core';

export type FieldType =
  | 'ShapePolygonPoints'
  | 'percent'
  | 'NodeShape'
  | 'LineStyle'
  | 'TextTransformation'
  | 'FontStyle'
  | 'FontWeight'
  | 'options'
  | 'Colour'
  | 'undefined'
  | 'object'
  | 'boolean'
  | 'number'
  | 'string'
  | 'function'
  | 'symbol'
  | 'bigint';

/**
 * Configuration for a dynamic form
 * This drives the fluid-form component to automatically generate forms
 */
export class FormInfo {
  constructor(
    public title: string,
    public fieldsets: FieldsetInfo[],
    public showSubmitButton = false,
    public submitText = 'Submit',
    public disableSubmitOnFormInvalid = false,
    public otherFieldsetTitle: string | null = null
  ) {}
}

/**
 * A group of related form fields
 */
export class FieldsetInfo {
  constructor(
    public legend: string,
    public fieldInfos: FieldInfo[],
    public displayOnlyIfProperties?: string[]
  ) {}

  /**
   * Determines if this fieldset should be shown based on the model
   */
  showFieldsetForModel(model: Record<string, any>): boolean {
    if (!this.displayOnlyIfProperties) {
      return true;
    }

    for (const fieldInfo of this.fieldInfos) {
      for (const modelProperty of Object.keys(model)) {
        if (fieldInfo.modelProperty === modelProperty) {
          return true;
        }
      }
    }
    return false;
  }
}

/**
 * Configuration for a single form field
 * Supports type inference, validation, and dynamic behavior
 */
export class FieldInfo {
  private fieldTypes: Record<string, FieldType> = {};
  updateOn: 'change' | 'blur' | 'submit' = 'change';
  asyncValidators?: AsyncValidatorFn[] | (() => AsyncValidatorFn[]);

  constructor(
    /* label to show the user next to the field, can be a function for i18n/dynamic labels */
    public label?: string | (() => string),
    /* The form has a model, this is the name of the property on the form's model object that this field */
    public modelProperty?: string,
    /* computed from the model property type by default */
    public type?: FieldType,
    /* The tooltip to display on hover */
    public tooltip?: string,
    /* The list of Angular Form Validators for the control or a function that returns such an array */
    public validators?: ValidatorFn[] | (() => ValidatorFn[]),
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
    public options?: any[] | string,
    /* In an options object, what field to display to the user (or function that returns a string
                  given the option object and the model) */
    public optionArrayLabelField?: string | ((option: any, model: any) => string),
    /* In an options object, what field to return for the value of the option
       (or function that returns a string given the option object and the model) */
    public optionArrayValueField?: string | ((option: any, model: any) => any)
  ) {}

  /**
   * Determines the field type from the model or explicit type
   */
  fieldType(model: Record<string, any>): FieldType {
    const cached = this.fieldTypes[this.modelProperty!];
    if (cached) {
      return cached;
    }

    const fieldValueType = typeof model[this.modelProperty!];
    const result: FieldType = this.type
      ? this.type
      : (this.options ? 'options' : fieldValueType as FieldType);

    this.fieldTypes[this.modelProperty!] = result;
    return result;
  }

  /**
   * Updates the model value and emits change event
   */
  setValue(newValue: any, model: Record<string, any>, modelChange: EventEmitter<any>): void {
    model[this.modelProperty!] = newValue;
    modelChange.emit({ property: this.modelProperty, value: newValue });
  }

  /**
   * Gets the display label for the field
   */
  getLabel(): string {
    if (typeof this.label === 'function') {
      return this.label();
    }
    return this.label || this.modelProperty || '';
  }

  /**
   * Gets the option label from an option object
   */
  getOptionLabel(option: any, model: any): string {
    if (typeof this.optionArrayLabelField === 'function') {
      return this.optionArrayLabelField(option, model);
    }
    if (this.optionArrayLabelField) {
      return option[this.optionArrayLabelField];
    }
    return option.label || option.name || String(option);
  }

  /**
   * Gets the option value from an option object
   */
  getOptionValue(option: any, model: any): any {
    if (typeof this.optionArrayValueField === 'function') {
      return this.optionArrayValueField(option, model);
    }
    if (this.optionArrayValueField) {
      return option[this.optionArrayValueField];
    }
    return option.value || option;
  }

  /**
   * Gets the options array (handles both direct arrays and property references)
   */
  getOptions(model: Record<string, any>): any[] {
    if (Array.isArray(this.options)) {
      return this.options;
    }
    if (typeof this.options === 'string') {
      return model[this.options] || [];
    }
    return [];
  }
}

import {
  Component,
  input,
  OnInit,
  signal,
  computed,
  effect,
  model,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  AsyncValidatorFn
} from '@angular/forms';
import { FormInfo, FieldInfo } from './form-info';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Fluid Form Component
 * 
 * A sophisticated dynamic form generator that creates form fields based on FormInfo configuration.
 * This component demonstrates advanced Angular patterns:
 * - Dynamic form generation from metadata
 * - Type-aware field rendering
 * - Reactive two-way binding
 * - Conditional field display
 * - Automatic validation
 * 
 * Perfect for showing different configuration options based on selected layout type or style.
 * 
 * @example
 * ```html
 * <cyng-fluid-form
 *   [(model)]="layoutOptions"
 *   [formInfo]="getFormInfoForLayout(layoutType)"
 * />
 * ```
 */
@Component({
  selector: 'cyng-fluid-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  template: `
    <form [formGroup]="formGroup()" [title]="formInfo()?.title" (ngSubmit)="onSubmit()">
      @for (fieldSetInfo of formInfo()?.fieldsets || []; track fieldSetInfo.legend) {
        @if (fieldSetInfo.showFieldsetForModel(model())) {
          <mat-expansion-panel [expanded]="true" class="fieldset">
            <mat-expansion-panel-header>
              <mat-panel-title>{{ fieldSetInfo.legend }}</mat-panel-title>
            </mat-expansion-panel-header>

            <div class="field-grid">
              @for (fieldInfo of fieldSetInfo.fieldInfos; track fieldInfo.modelProperty) {
                @if (shouldShowField(fieldInfo)) {
                  <div class="field-wrapper">
                    <!-- Boolean Field (Slide Toggle) -->
                    @if (fieldInfo.fieldType(model()) === 'boolean') {
                      <mat-slide-toggle
                        [formControlName]="fieldInfo.modelProperty!"
                        [matTooltip]="fieldInfo.tooltip || ''"
                        color="primary">
                        {{ fieldInfo.getLabel() }}
                      </mat-slide-toggle>
                    }

                    <!-- String or Number Input -->
                    @if (fieldInfo.fieldType(model()) === 'string' || fieldInfo.fieldType(model()) === 'number') {
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>{{ fieldInfo.getLabel() }}</mat-label>
                        <input matInput
                               [formControlName]="fieldInfo.modelProperty!"
                               [type]="fieldInfo.inputType"
                               [matTooltip]="fieldInfo.tooltip || ''"
                               [placeholder]="fieldInfo.placeholder || ''">
                        @if (fieldInfo.modelProperty && formGroup().get(fieldInfo.modelProperty)?.hasError('required')) {
                          <mat-error>This field is required</mat-error>
                        }
                        @if (fieldInfo.modelProperty && formGroup().get(fieldInfo.modelProperty)?.hasError('min')) {
                          <mat-error>Value too small</mat-error>
                        }
                        @if (fieldInfo.modelProperty && formGroup().get(fieldInfo.modelProperty)?.hasError('max')) {
                          <mat-error>Value too large</mat-error>
                        }
                      </mat-form-field>
                    }

                    <!-- Dropdown (Options) -->
                    @if (fieldInfo.fieldType(model()) === 'options') {
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>{{ fieldInfo.getLabel() }}</mat-label>
                        <mat-select
                          [formControlName]="fieldInfo.modelProperty!"
                          [matTooltip]="fieldInfo.tooltip || ''">
                          @for (option of fieldInfo.getOptions(model()); track option) {
                            <mat-option [value]="fieldInfo.getOptionValue(option, model())">
                              {{ fieldInfo.getOptionLabel(option, model()) }}
                            </mat-option>
                          }
                        </mat-select>
                      </mat-form-field>
                    }
                  </div>
                }
              }
            </div>
          </mat-expansion-panel>
        }
      }

      @if (formInfo()?.showSubmitButton) {
        <button mat-raised-button
                color="primary"
                type="submit"
                [disabled]="formInfo().disableSubmitOnFormInvalid && !formGroup().valid"
                class="submit-button">
          {{ formInfo().submitText || 'Submit' }}
        </button>
      }
    </form>
  `,
  styles: [`
    :host {
      display: block;
    }

    .fieldset {
      margin-bottom: 16px;
    }

    .field-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      padding: 16px 0;
    }

    .field-wrapper {
      display: flex;
      align-items: center;
    }

    .full-width {
      width: 100%;
    }

    mat-slide-toggle {
      margin: 8px 0;
    }

    .submit-button {
      margin-top: 16px;
      width: 100%;
    }

    ::ng-deep .mat-expansion-panel-body {
      padding-top: 16px !important;
    }
  `]
})
export class FluidFormComponent implements OnInit {
  // Two-way binding for the model
  readonly model = model.required<Record<string, any>>();
  
  // Form configuration
  readonly formInfo = input.required<FormInfo>();

  // Form group signal
  protected readonly formGroup = signal<FormGroup>(new FormGroup({}));

  constructor() {
    // Effect to rebuild form when formInfo changes
    effect(() => {
      const info = this.formInfo();
      if (info) {
        this.buildForm(info);
      }
    }, { allowSignalWrites: true });

    // Effect to update form values when model changes externally
    effect(() => {
      const currentModel = this.model();
      const group = this.formGroup();
      
      if (group && currentModel) {
        this.updateFormFromModel(currentModel, group);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    const info = this.formInfo();
    if (info) {
      this.buildForm(info);
    }
  }

  /**
   * Builds the reactive form from FormInfo configuration
   */
  private buildForm(formInfo: FormInfo): void {
    const controls: Record<string, FormControl> = {};
    const currentModel = this.model();

    formInfo.fieldsets.forEach(fieldsetInfo => {
      fieldsetInfo.fieldInfos.forEach(fieldInfo => {
        if (!fieldInfo.modelProperty) {
          return;
        }

        const modelValue = currentModel[fieldInfo.modelProperty];
        
        // Get validators
        const validators: ValidatorFn[] = typeof fieldInfo.validators === 'function'
          ? fieldInfo.validators()
          : fieldInfo.validators || [];
        
        const asyncValidators: AsyncValidatorFn[] = typeof fieldInfo.asyncValidators === 'function'
          ? fieldInfo.asyncValidators()
          : fieldInfo.asyncValidators || [];
        
        const { updateOn } = fieldInfo;

        // Create form control
        const formControl = new FormControl(modelValue, {
          validators,
          asyncValidators,
          updateOn
        });

        // Subscribe to value changes
        formControl.valueChanges.subscribe(change => {
          this.onFieldChange(fieldInfo, change);
        });

        controls[fieldInfo.modelProperty] = formControl;
      });
    });

    this.formGroup.set(new FormGroup(controls));
  }

  /**
   * Handles field value changes
   */
  private onFieldChange(fieldInfo: FieldInfo, newValue: any): void {
    const currentModel = this.model();
    const updatedModel = { ...currentModel };
    
    // Create a dummy EventEmitter for compatibility
    const emitter = new EventEmitter<any>();
    fieldInfo.setValue(newValue, updatedModel, emitter);
    
    // Update the model signal
    this.model.set(updatedModel);
  }

  /**
   * Updates form controls from model without triggering valueChanges
   */
  private updateFormFromModel(model: Record<string, any>, formGroup: FormGroup): void {
    Object.keys(model).forEach(key => {
      const control = formGroup.get(key);
      if (control && control.value !== model[key]) {
        control.setValue(model[key], { emitEvent: false });
      }
    });
  }

  /**
   * Determines if a field should be displayed
   */
  protected shouldShowField(fieldInfo: FieldInfo): boolean {
    if (!fieldInfo.modelProperty) {
      return false;
    }

    const currentModel = this.model();
    
    if (fieldInfo.hideWhenNoModelProperty && 
        currentModel[fieldInfo.modelProperty] === undefined) {
      return false;
    }

    return true;
  }

  protected onSubmit(): void {
    console.log('Form submitted', this.formGroup().value);
  }
}

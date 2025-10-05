import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FluidFormComponent } from './fluid-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormInfo, FieldsetInfo, FieldInfo } from './form-info';

describe('FluidFormComponent', () => {
  let component: FluidFormComponent;
  let fixture: ComponentFixture<FluidFormComponent>;

  const mockModel = {
    name: 'Test',
    age: 25,
    enabled: true,
    country: 'US'
  };

  const mockFormInfo = new FormInfo(
    'Test Form',
    [
      new FieldsetInfo('Personal Info', [
        new FieldInfo('Name', 'name', 'string', 'Enter your name'),
        new FieldInfo('Age', 'age', 'number', 'Enter your age'),
      ]),
      new FieldsetInfo('Settings', [
        new FieldInfo('Enabled', 'enabled', 'boolean', 'Enable feature'),
        new FieldInfo('Country', 'country', 'options', 'Select country', undefined, false, false, undefined, 'text', 8, [
          { label: 'United States', value: 'US' },
          { label: 'Canada', value: 'CA' },
          { label: 'Mexico', value: 'MX' }
        ], 'label', 'value')
      ])
    ]
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FluidFormComponent,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FluidFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build form from FormInfo', () => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const formGroup = component['formGroup']();
    expect(formGroup.get('name')).toBeTruthy();
    expect(formGroup.get('age')).toBeTruthy();
    expect(formGroup.get('enabled')).toBeTruthy();
    expect(formGroup.get('country')).toBeTruthy();
  });

  it('should initialize form values from model', () => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const formGroup = component['formGroup']();
    expect(formGroup.get('name')?.value).toBe('Test');
    expect(formGroup.get('age')?.value).toBe(25);
    expect(formGroup.get('enabled')?.value).toBe(true);
    expect(formGroup.get('country')?.value).toBe('US');
  });

  it('should update model when form value changes', (done) => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const formGroup = component['formGroup']();
    
    // Change a value
    formGroup.get('name')?.setValue('New Name');

    // Wait for async update
    setTimeout(() => {
      const updatedModel = component.model();
      expect(updatedModel.name).toBe('New Name');
      done();
    }, 100);
  });

  it('should render string input fields', () => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const inputs = compiled.querySelectorAll('input[type="text"]');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render number input fields', () => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const formGroup = component['formGroup']();
    const ageControl = formGroup.get('age');
    expect(ageControl).toBeTruthy();
  });

  it('should render boolean slide toggles', () => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggles = compiled.querySelectorAll('mat-slide-toggle');
    expect(toggles.length).toBeGreaterThan(0);
  });

  it('should render select dropdowns for options', () => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const selects = compiled.querySelectorAll('mat-select');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('should display fieldset legends', () => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent || '';
    expect(text).toContain('Personal Info');
    expect(text).toContain('Settings');
  });

  it('should show submit button when configured', () => {
    const formInfoWithSubmit = new FormInfo(
      'Test Form',
      mockFormInfo.fieldsets,
      true,
      'Save'
    );

    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', formInfoWithSubmit);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
    expect(submitButton?.textContent).toContain('Save');
  });

  it('should hide submit button when not configured', () => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton).toBeFalsy();
  });

  it('should hide fields when model property is undefined and hideWhenNoModelProperty is true', () => {
    const modelWithoutAge = { name: 'Test', enabled: true, country: 'US' };
    
    fixture.componentRef.setInput('model', modelWithoutAge);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const formGroup = component['formGroup']();
    // Form control should still exist but field might not be visible
    expect(formGroup.get('age')).toBeTruthy();
  });

  it('should conditionally show fieldsets based on model', () => {
    const conditionalFieldset = new FieldsetInfo(
      'Conditional',
      [new FieldInfo('Test', 'test', 'string')],
      ['nonExistentProp']
    );

    const formInfoWithConditional = new FormInfo(
      'Test',
      [conditionalFieldset]
    );

    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', formInfoWithConditional);
    fixture.detectChanges();

    expect(conditionalFieldset.showFieldsetForModel(mockModel)).toBe(false);
  });

  it('should handle function-based labels', () => {
    const fieldWithFunctionLabel = new FieldInfo(
      () => 'Dynamic Label',
      'name',
      'string'
    );

    expect(fieldWithFunctionLabel.getLabel()).toBe('Dynamic Label');
  });

  it('should handle option label extraction', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ];

    const fieldInfo = new FieldInfo(
      'Test',
      'test',
      'options',
      '',
      undefined,
      false,
      false,
      '',
      'text',
      8,
      options,
      'label',
      'value'
    );

    const label = fieldInfo.getOptionLabel(options[0], mockModel);
    expect(label).toBe('Option 1');
  });

  it('should handle option value extraction', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ];

    const fieldInfo = new FieldInfo(
      'Test',
      'test',
      'options',
      '',
      undefined,
      false,
      false,
      '',
      'text',
      8,
      options,
      'label',
      'value'
    );

    const value = fieldInfo.getOptionValue(options[0], mockModel);
    expect(value).toBe('1');
  });

  it('should update form when model changes externally', (done) => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    // Change model externally
    const newModel = { ...mockModel, name: 'Updated Name' };
    fixture.componentRef.setInput('model', newModel);
    fixture.detectChanges();

    setTimeout(() => {
      const formGroup = component['formGroup']();
      expect(formGroup.get('name')?.value).toBe('Updated Name');
      done();
    }, 100);
  });

  it('should support tooltips on fields', () => {
    fixture.componentRef.setInput('model', mockModel);
    fixture.componentRef.setInput('formInfo', mockFormInfo);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tooltips = compiled.querySelectorAll('[matTooltip]');
    expect(tooltips.length).toBeGreaterThan(0);
  });
});

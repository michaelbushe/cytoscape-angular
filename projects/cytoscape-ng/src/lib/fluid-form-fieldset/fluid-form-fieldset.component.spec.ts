import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidFormFieldsetComponent } from './fluid-form-fieldset.component';

describe('FluidFormFieldsetComponent', () => {
  let component: FluidFormFieldsetComponent;
  let fixture: ComponentFixture<FluidFormFieldsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidFormFieldsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidFormFieldsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

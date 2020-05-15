import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidFormComponent } from './fluid-form.component';

describe('FluidFormFieldsetComponent', () => {
  let component: FluidFormComponent;
  let fixture: ComponentFixture<FluidFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

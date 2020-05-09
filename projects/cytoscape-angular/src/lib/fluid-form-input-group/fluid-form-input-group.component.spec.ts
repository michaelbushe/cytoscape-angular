import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidFormInputGroupComponent } from './fluid-form-input-group.component';

describe('FluidFormInputGroupComponent', () => {
  let component: FluidFormInputGroupComponent;
  let fixture: ComponentFixture<FluidFormInputGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidFormInputGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidFormInputGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

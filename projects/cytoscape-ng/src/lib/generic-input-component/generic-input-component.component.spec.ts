import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericInputComponentComponent } from './generic-input-component.component';

describe('GenericInputComponentComponent', () => {
  let component: GenericInputComponentComponent;
  let fixture: ComponentFixture<GenericInputComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericInputComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericInputComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

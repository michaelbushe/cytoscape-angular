import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCytoscapeComponent } from './ng-cytoscape.component';

describe('NgCytoscapeComponent', () => {
  let component: NgCytoscapeComponent;
  let fixture: ComponentFixture<NgCytoscapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgCytoscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCytoscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

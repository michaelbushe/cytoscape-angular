import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoscapeGraphComponent } from './cytoscape-ng.component';

describe('CytoscapeGraphComponent', () => {
  let component: CytoscapeGraphComponent;
  let fixture: ComponentFixture<CytoscapeGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoscapeGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoscapeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

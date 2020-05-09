import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoscapeStyleToolComponent } from './cytoscape-style-tool.component';

describe('CytoscapeStyleToolComponent', () => {
  let component: CytoscapeStyleToolComponent;
  let fixture: ComponentFixture<CytoscapeStyleToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoscapeStyleToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoscapeStyleToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

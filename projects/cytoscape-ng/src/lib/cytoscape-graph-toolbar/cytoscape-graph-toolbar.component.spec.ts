import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CytoscapeGraphToolbarComponent } from './cytoscape-graph-toolbar.component'

describe('CytoscapeGraphToolbarComponent', () => {
  let component: CytoscapeGraphToolbarComponent
  let fixture: ComponentFixture<CytoscapeGraphToolbarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoscapeGraphToolbarComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoscapeGraphToolbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CytoscapeLayoutToolComponent } from './cytoscape-layout-tool.component'

describe('CytoscapeGraphToolbarComponent', () => {
  let component: CytoscapeLayoutToolComponent
  let fixture: ComponentFixture<CytoscapeLayoutToolComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoscapeLayoutToolComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoscapeLayoutToolComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

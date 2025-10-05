import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CytoscapeGraphComponent } from './cytoscape-graph.component';
import type { EdgeDefinition, LayoutOptions, NodeDefinition, Stylesheet } from 'cytoscape';

describe('CytoscapeGraphComponent', () => {
  let component: CytoscapeGraphComponent;
  let fixture: ComponentFixture<CytoscapeGraphComponent>;

  const mockNodes: NodeDefinition[] = [
    { data: { id: 'node1', label: 'Node 1' } },
    { data: { id: 'node2', label: 'Node 2' } },
    { data: { id: 'node3', label: 'Node 3' } }
  ];

  const mockEdges: EdgeDefinition[] = [
    { data: { id: 'edge1', source: 'node1', target: 'node2' } },
    { data: { id: 'edge2', source: 'node2', target: 'node3' } }
  ];

  const mockLayout: LayoutOptions = {
    name: 'grid',
    rows: 2
  };

  const mockStyle: Stylesheet[] = [
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(label)'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc'
      }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CytoscapeGraphComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CytoscapeGraphComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty graph by default', () => {
    fixture.detectChanges();
    expect(component.getCytoscapeInstance()).toBeNull();
  });

  it('should render graph with nodes and edges', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('edges', mockEdges);
    
    component.graphReady.subscribe((cy) => {
      expect(cy).toBeTruthy();
      expect(cy.nodes().length).toBe(3);
      expect(cy.edges().length).toBe(2);
      done();
    });

    fixture.detectChanges();
  });

  it('should apply layout options', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('edges', mockEdges);
    fixture.componentRef.setInput('layoutOptions', mockLayout);

    component.graphReady.subscribe((cy) => {
      expect(cy).toBeTruthy();
      // Verify nodes are positioned (grid layout should position them)
      const node1 = cy.$('#node1');
      expect(node1.position()).toBeDefined();
      expect(node1.position().x).toBeGreaterThan(0);
      done();
    });

    fixture.detectChanges();
  });

  it('should apply styles', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('style', mockStyle);

    component.graphReady.subscribe((cy) => {
      const node = cy.$('#node1');
      const computedStyle = node.style();
      expect(computedStyle['background-color']).toBeDefined();
      done();
    });

    fixture.detectChanges();
  });

  it('should update when nodes change', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.detectChanges();

    let callCount = 0;
    component.graphReady.subscribe((cy) => {
      callCount++;
      if (callCount === 1) {
        expect(cy.nodes().length).toBe(3);
        
        // Update nodes
        const newNodes: NodeDefinition[] = [
          ...mockNodes,
          { data: { id: 'node4', label: 'Node 4' } }
        ];
        fixture.componentRef.setInput('nodes', newNodes);
        fixture.detectChanges();
      } else if (callCount === 2) {
        expect(cy.nodes().length).toBe(4);
        done();
      }
    });
  });

  it('should center elements by selector', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('edges', mockEdges);

    component.graphReady.subscribe((cy) => {
      component.centerElements('#node1');
      
      // Verify the pan has changed (centering moves the viewport)
      const pan = cy.pan();
      expect(pan).toBeDefined();
      done();
    });

    fixture.detectChanges();
  });

  it('should zoom to element', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('edges', mockEdges);

    component.graphReady.subscribe((cy) => {
      const initialZoom = cy.zoom();
      component.zoomToElement('#node1', 5);
      
      const newZoom = cy.zoom();
      expect(newZoom).toBeGreaterThan(initialZoom);
      expect(newZoom).toBeCloseTo(5, 0);
      done();
    });

    fixture.detectChanges();
  });

  it('should handle empty selector gracefully in centerElements', () => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.detectChanges();

    expect(() => {
      component.centerElements('#nonexistent');
    }).not.toThrow();
  });

  it('should handle empty selector gracefully in zoomToElement', () => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.detectChanges();

    expect(() => {
      component.zoomToElement('#nonexistent');
    }).not.toThrow();
  });

  it('should show loading spinner', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    component['loading'].set(true);
    fixture.detectChanges();

    const spinner = compiled.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should hide loading spinner after render', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);
    
    component.graphReady.subscribe(() => {
      // Wait for async loading state update
      setTimeout(() => {
        expect(component['loading']()).toBe(false);
        done();
      }, 100);
    });

    fixture.detectChanges();
  });

  it('should enable/disable user interactions', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('userPanningEnabled', false);
    fixture.componentRef.setInput('userZoomingEnabled', false);

    component.graphReady.subscribe((cy) => {
      expect(cy.userPanningEnabled()).toBe(false);
      expect(cy.userZoomingEnabled()).toBe(false);
      done();
    });

    fixture.detectChanges();
  });

  it('should set box selection enabled', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('boxSelectionEnabled', false);

    component.graphReady.subscribe((cy) => {
      expect(cy.boxSelectionEnabled()).toBe(false);
      done();
    });

    fixture.detectChanges();
  });

  it('should destroy cytoscape instance on component destroy', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);

    component.graphReady.subscribe((cy) => {
      const destroySpy = spyOn(cy, 'destroy');
      
      // Trigger another render which destroys the old instance
      component.render();
      
      setTimeout(() => {
        expect(destroySpy).toHaveBeenCalled();
        done();
      }, 100);
    });

    fixture.detectChanges();
  });

  it('should return cytoscape instance via getter', (done) => {
    fixture.componentRef.setInput('nodes', mockNodes);

    component.graphReady.subscribe((cy) => {
      const instance = component.getCytoscapeInstance();
      expect(instance).toBe(cy);
      done();
    });

    fixture.detectChanges();
  });

  it('should log debug information when debug is enabled', (done) => {
    spyOn(console, 'log');
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('debug', true);

    component.graphReady.subscribe(() => {
      expect(console.log).toHaveBeenCalledWith(
        jasmine.stringContaining('[CytoscapeGraph]'),
        jasmine.anything()
      );
      done();
    });

    fixture.detectChanges();
  });

  it('should handle render errors gracefully', () => {
    spyOn(console, 'error');
    
    // Force an error by not having a container
    component['cyGraphElement'] = null as any;
    
    expect(() => {
      component.render();
    }).not.toThrow();
  });
});

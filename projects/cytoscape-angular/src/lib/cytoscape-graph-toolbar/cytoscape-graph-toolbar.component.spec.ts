import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CytoscapeGraphToolbarComponent } from './cytoscape-graph-toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { EdgeDefinition, LayoutOptions, NodeDefinition, Stylesheet } from 'cytoscape';

describe('CytoscapeGraphToolbarComponent', () => {
  let component: CytoscapeGraphToolbarComponent;
  let fixture: ComponentFixture<CytoscapeGraphToolbarComponent>;

  const mockNodes: NodeDefinition[] = [
    { data: { id: 'node1', label: 'Node 1' } },
    { data: { id: 'node2', label: 'Node 2' } }
  ];

  const mockEdges: EdgeDefinition[] = [
    { data: { id: 'edge1', source: 'node1', target: 'node2' } }
  ];

  const mockLayout: LayoutOptions = {
    name: 'grid',
    rows: 2
  };

  const mockStyles: Stylesheet[] = [
    {
      selector: 'node',
      style: {
        'background-color': '#666'
      }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CytoscapeGraphToolbarComponent,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CytoscapeGraphToolbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display node and edge counts', () => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('edges', mockEdges);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const stats = compiled.textContent;
    
    expect(stats).toContain('2 Nodes');
    expect(stats).toContain('1 Edge');
  });

  it('should apply row layout by default', () => {
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.toolbar-container');
    expect(container?.classList.contains('row-layout')).toBe(true);
  });

  it('should apply column layout when specified', () => {
    fixture.componentRef.setInput('direction', 'column');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.toolbar-container');
    expect(container?.classList.contains('column-layout')).toBe(true);
  });

  it('should show toolbar buttons when enabled', () => {
    fixture.componentRef.setInput('showToolbarButtons', true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should hide toolbar buttons when disabled', () => {
    fixture.componentRef.setInput('showToolbarButtons', false);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });

  it('should emit styleSelectorChange event', (done) => {
    component.styleSelectorChange.subscribe((selector) => {
      expect(selector).toBe('#testSelector');
      done();
    });

    component['onStyleSelectorChange']('#testSelector');
  });

  it('should update layoutOptions via model', () => {
    const newLayout: LayoutOptions = { name: 'circle' };
    component.layoutOptions.set(newLayout);

    expect(component.layoutOptions()).toEqual(newLayout);
  });

  it('should update styles via model', () => {
    component.styles.set(mockStyles);

    expect(component.styles()).toEqual(mockStyles);
  });

  it('should display layout button with correct label', () => {
    fixture.componentRef.setInput('showToolbarButtons', true);
    component.layoutOptions.set({ name: 'circle' });
    fixture.detectChanges();

    const button = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    ).find(btn => btn.textContent?.includes('Circle'));

    expect(button).toBeTruthy();
  });

  it('should capitalize layout name in button', () => {
    fixture.componentRef.setInput('showToolbarButtons', true);
    component.layoutOptions.set({ name: 'breadthfirst' });
    fixture.detectChanges();

    const label = component['layoutButtonLabel']();
    expect(label).toBe('Breadthfirst');
  });

  it('should show stats when enabled', () => {
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.componentRef.setInput('showStats', true);
    fixture.detectChanges();

    const statsContainer = fixture.nativeElement.querySelector('.stats-container');
    expect(statsContainer).toBeTruthy();
  });

  it('should hide stats when disabled', () => {
    fixture.componentRef.setInput('showStats', false);
    fixture.detectChanges();

    const statsContainer = fixture.nativeElement.querySelector('.stats-container');
    expect(statsContainer).toBeFalsy();
  });

  it('should handle empty nodes array', () => {
    fixture.componentRef.setInput('nodes', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('0 Nodes');
  });

  it('should handle empty edges array', () => {
    fixture.componentRef.setInput('edges', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('0 Edges');
  });
});

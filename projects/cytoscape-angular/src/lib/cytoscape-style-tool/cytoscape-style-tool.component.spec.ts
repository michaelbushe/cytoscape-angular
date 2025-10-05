import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CytoscapeStyleToolComponent } from './cytoscape-style-tool.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Stylesheet } from 'cytoscape';

describe('CytoscapeStyleToolComponent', () => {
  let component: CytoscapeStyleToolComponent;
  let fixture: ComponentFixture<CytoscapeStyleToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CytoscapeStyleToolComponent,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CytoscapeStyleToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default styles', () => {
    const styles = component.styles();
    expect(styles.length).toBeGreaterThan(0);
    const nodeStyle = styles.find(s => s.selector === 'node');
    expect(nodeStyle).toBeTruthy();
  });

  it('should update node background color', () => {
    component['nodeBackgroundColor'].set('#ff0000');
    component['updateStyles']();

    const styles = component.styles();
    const nodeStyle = styles.find(s => s.selector === 'node');
    expect(nodeStyle?.style?.['background-color']).toBe('#ff0000');
  });

  it('should update node shape', () => {
    component['nodeShape'].set('diamond');
    component['updateStyles']();

    const styles = component.styles();
    const nodeStyle = styles.find(s => s.selector === 'node');
    expect(nodeStyle?.style?.['shape']).toBe('diamond');
  });

  it('should update edge line color', () => {
    component['edgeLineColor'].set('#00ff00');
    component['updateStyles']();

    const styles = component.styles();
    const edgeStyle = styles.find(s => s.selector === 'edge');
    expect(edgeStyle?.style?.['line-color']).toBe('#00ff00');
  });

  it('should update edge curve style', () => {
    component['edgeCurveStyle'].set('straight');
    component['updateStyles']();

    const styles = component.styles();
    const edgeStyle = styles.find(s => s.selector === 'edge');
    expect(edgeStyle?.style?.['curve-style']).toBe('straight');
  });

  it('should compute isNodeSelector correctly', () => {
    component['selectedSelector'].set('node');
    expect(component['isNodeSelector']()).toBe(true);

    component['selectedSelector'].set('edge');
    expect(component['isNodeSelector']()).toBe(false);

    component['selectedSelector'].set('node:selected');
    expect(component['isNodeSelector']()).toBe(true);
  });

  it('should compute isEdgeSelector correctly', () => {
    component['selectedSelector'].set('edge');
    expect(component['isEdgeSelector']()).toBe(true);

    component['selectedSelector'].set('node');
    expect(component['isEdgeSelector']()).toBe(false);

    component['selectedSelector'].set('edge:selected');
    expect(component['isEdgeSelector']()).toBe(true);
  });

  it('should emit styleSelectorChange event', (done) => {
    component.styleSelectorChange.subscribe((selector) => {
      expect(selector).toBe('node');
      done();
    });

    component['emitSelectorChange']();
  });

  it('should load styles from existing stylesheet', () => {
    const customStyles: Stylesheet[] = [
      {
        selector: 'node',
        style: {
          'background-color': '#123456',
          'shape': 'hexagon',
          'width': 60
        }
      },
      {
        selector: 'edge',
        style: {
          'line-color': '#654321',
          'width': 5
        }
      }
    ];

    component['loadStylesFromStylesheet'](customStyles);

    expect(component['nodeBackgroundColor']()).toBe('#123456');
    expect(component['nodeShape']()).toBe('hexagon');
    expect(component['nodeWidth']()).toBe(60);
    expect(component['edgeLineColor']()).toBe('#654321');
    expect(component['edgeWidth']()).toBe(5);
  });

  it('should include selected element styles', () => {
    component['updateStyles']();
    const styles = component.styles();
    
    const selectedStyle = styles.find(s => s.selector === ':selected');
    expect(selectedStyle).toBeTruthy();
    expect(selectedStyle?.style?.['background-color']).toBeDefined();
  });

  it('should update node label properties', () => {
    component['nodeLabel'].set('data(name)');
    component['nodeLabelFontSize'].set(16);
    component['nodeLabelColor'].set('#ffffff');
    component['updateStyles']();

    const styles = component.styles();
    const nodeStyle = styles.find(s => s.selector === 'node');
    expect(nodeStyle?.style?.['label']).toBe('data(name)');
    expect(nodeStyle?.style?.['font-size']).toBe(16);
    expect(nodeStyle?.style?.['color']).toBe('#ffffff');
  });

  it('should update edge arrow properties', () => {
    component['edgeTargetArrowShape'].set('diamond');
    component['edgeTargetArrowColor'].set('#123456');
    component['updateStyles']();

    const styles = component.styles();
    const edgeStyle = styles.find(s => s.selector === 'edge');
    expect(edgeStyle?.style?.['target-arrow-shape']).toBe('diamond');
    expect(edgeStyle?.style?.['target-arrow-color']).toBe('#123456');
  });

  it('should update node border properties', () => {
    component['nodeBorderColor'].set('#abcdef');
    component['nodeBorderWidth'].set(5);
    component['updateStyles']();

    const styles = component.styles();
    const nodeStyle = styles.find(s => s.selector === 'node');
    expect(nodeStyle?.style?.['border-color']).toBe('#abcdef');
    expect(nodeStyle?.style?.['border-width']).toBe(5);
  });

  it('should update edge line style', () => {
    component['edgeLineStyle'].set('dashed');
    component['updateStyles']();

    const styles = component.styles();
    const edgeStyle = styles.find(s => s.selector === 'edge');
    expect(edgeStyle?.style?.['line-style']).toBe('dashed');
  });

  it('should change selector and update styles', () => {
    component['selectedSelector'].set('edge');
    component['onSelectorChange']();

    expect(component['selectedSelector']()).toBe('edge');
  });
});

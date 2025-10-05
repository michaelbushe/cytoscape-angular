import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CytoscapeLayoutToolComponent } from './cytoscape-layout-tool.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { LayoutOptions } from 'cytoscape';

describe('CytoscapeLayoutToolComponent', () => {
  let component: CytoscapeLayoutToolComponent;
  let fixture: ComponentFixture<CytoscapeLayoutToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CytoscapeLayoutToolComponent,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CytoscapeLayoutToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with grid layout by default', () => {
    const options = component.layoutOptions();
    expect(options.name).toBe('grid');
  });

  it('should change layout type', () => {
    component['onLayoutTypeChange']('circle');
    expect(component['selectedLayout']()).toBe('circle');
    expect(component.layoutOptions().name).toBe('circle');
  });

  it('should update grid layout options', () => {
    component['selectedLayout'].set('grid');
    component['gridRows'].set(3);
    component['gridCols'].set(4);
    component['gridCondense'].set(true);
    component['updateLayoutOptions']();

    const options = component.layoutOptions() as any;
    expect(options.name).toBe('grid');
    expect(options.rows).toBe(3);
    expect(options.cols).toBe(4);
    expect(options.condense).toBe(true);
  });

  it('should update circle layout options', () => {
    component['onLayoutTypeChange']('circle');
    component['circleRadius'].set(100);
    component['circleStartAngle'].set(1.5);
    component['circleClockwise'].set(false);
    component['updateLayoutOptions']();

    const options = component.layoutOptions() as any;
    expect(options.name).toBe('circle');
    expect(options.radius).toBe(100);
    expect(options.startAngle).toBe(1.5);
    expect(options.clockwise).toBe(false);
  });

  it('should update CoSE layout options', () => {
    component['onLayoutTypeChange']('cose');
    component['coseNodeOverlap'].set(30);
    component['coseIdealEdgeLength'].set(150);
    component['coseNumIter'].set(2000);
    component['updateLayoutOptions']();

    const options = component.layoutOptions() as any;
    expect(options.name).toBe('cose');
    expect(options.nodeOverlap).toBe(30);
    expect(options.idealEdgeLength).toBe(150);
    expect(options.numIter).toBe(2000);
  });

  it('should update Dagre layout options', () => {
    component['onLayoutTypeChange']('dagre');
    component['dagreRankDir'].set('LR');
    component['dagreNodeSep'].set(60);
    component['dagreRankSep'].set(80);
    component['updateLayoutOptions']();

    const options = component.layoutOptions() as any;
    expect(options.name).toBe('dagre');
    expect(options.rankDir).toBe('LR');
    expect(options.nodeSep).toBe(60);
    expect(options.rankSep).toBe(80);
  });

  it('should update common layout options', () => {
    component['commonPadding'].set(50);
    component['commonAnimate'].set(true);
    component['commonAnimationDuration'].set(1000);
    component['updateLayoutOptions']();

    const options = component.layoutOptions();
    expect(options.padding).toBe(50);
    expect(options.animate).toBe(true);
    expect(options.animationDuration).toBe(1000);
  });

  it('should load options from existing layout configuration', () => {
    const initialOptions: LayoutOptions = {
      name: 'circle',
      radius: 200,
      startAngle: 0.5,
      padding: 40,
      animate: true
    } as any;

    component.layoutOptions.set(initialOptions);
    component['loadOptionsFromLayout'](initialOptions);

    expect(component['circleRadius']()).toBe(200);
    expect(component['circleStartAngle']()).toBe(0.5);
    expect(component['commonPadding']()).toBe(40);
    expect(component['commonAnimate']()).toBe(true);
  });

  it('should have all required layout types available', () => {
    const layouts = component['availableLayouts']();
    const layoutNames = layouts.map(l => l.value);

    expect(layoutNames).toContain('grid');
    expect(layoutNames).toContain('circle');
    expect(layoutNames).toContain('concentric');
    expect(layoutNames).toContain('breadthfirst');
    expect(layoutNames).toContain('cose');
    expect(layoutNames).toContain('dagre');
    expect(layoutNames).toContain('preset');
    expect(layoutNames).toContain('random');
  });

  it('should compute selected layout description', () => {
    component['selectedLayout'].set('dagre');
    const description = component['selectedLayoutDescription']();
    expect(description).toContain('Hierarchical');
  });

  it('should handle breadthfirst layout options', () => {
    component['onLayoutTypeChange']('breadthfirst');
    component['breadthfirstDirected'].set(true);
    component['breadthfirstCircle'].set(true);
    component['breadthfirstSpacing'].set(40);
    component['updateLayoutOptions']();

    const options = component.layoutOptions() as any;
    expect(options.name).toBe('breadthfirst');
    expect(options.directed).toBe(true);
    expect(options.circle).toBe(true);
    expect(options.spacing).toBe(40);
  });

  it('should handle concentric layout options', () => {
    component['onLayoutTypeChange']('concentric');
    component['concentricMinNodeSpacing'].set(20);
    component['concentricEquidistant'].set(true);
    component['updateLayoutOptions']();

    const options = component.layoutOptions() as any;
    expect(options.name).toBe('concentric');
    expect(options.minNodeSpacing).toBe(20);
    expect(options.equidistant).toBe(true);
  });

  it('should update layout options when model changes', () => {
    const newOptions: LayoutOptions = {
      name: 'random',
      padding: 25
    };

    component.layoutOptions.set(newOptions);
    expect(component.layoutOptions()).toEqual(newOptions);
  });

  it('should render layout selector', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('mat-select');
    expect(select).toBeTruthy();
  });

  it('should display current layout description', () => {
    component['selectedLayout'].set('grid');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const hint = compiled.querySelector('mat-hint');
    expect(hint?.textContent).toContain('grid');
  });
});

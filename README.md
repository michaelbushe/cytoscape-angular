# Cytoscape Angular

**Modern Angular 20+ component library for Cytoscape graph visualization**

[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-ready Angular library providing sophisticated graph visualization capabilities using [Cytoscape.js](https://js.cytoscape.org/). 

## 🌟 Key Features

- **🎯 Modern Angular 20** - Built with the latest Angular features: signals, standalone components, and proper RxJS patterns
- **📊 Dynamic Forms** - Sophisticated form system that automatically adapts based on graph layout type
- **⚡ Signal-Based** - Reactive state management using Angular signals for optimal performance
- **🎨 Material Design** - Beautiful UI components using Angular Material
- **💪 Type-Safe** - Full TypeScript support with comprehensive type definitions
- **🧪 Well-Tested** - Extensive test coverage with Jasmine and Karma
- **🏢 Production-Ready** - Professional code patterns suitable for enterprise applications

## 🎓 Technical Features

1. **Dynamic Form Generation** - Forms that change based on configuration metadata (see `FluidFormComponent`)
2. **Signal-Based Architecture** - Modern reactive patterns with Angular signals
3. **Standalone Components** - Latest Angular architecture without NgModules
4. **Type-Safe Configuration** - Self-describing components with type-safe metadata
5. **Professional Testing** - Comprehensive unit and integration tests

## 🚀 Quick Start

### Installation

```bash
npm install cytoscape-angular cytoscape cytoscape-dagre
npm install @angular/material @angular/cdk
```

### Basic Usage

```typescript
import { Component, signal } from '@angular/core';
import { 
  CytoscapeGraphComponent, 
  CytoscapeGraphToolbarComponent,
  GridLayoutOptions 
} from 'cytoscape-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CytoscapeGraphComponent, CytoscapeGraphToolbarComponent],
  template: `
    <cyng-cytoscape-graph
      [nodes]="nodes()"
      [edges]="edges()"
      [layoutOptions]="layoutOptions()"
    />
    
    <cyng-cytoscape-graph-toolbar
      [(layoutOptions)]="layoutOptions"
      [nodes]="nodes()"
      [edges]="edges()"
    />
  `
})
export class AppComponent {
  nodes = signal([
    { data: { id: 'a', label: 'Node A' } },
    { data: { id: 'b', label: 'Node B' } }
  ]);
  
  edges = signal([
    { data: { id: 'ab', source: 'a', target: 'b' } }
  ]);
  
  layoutOptions = signal(new GridLayoutOptions());
}
```

## 📚 Components

### CytoscapeGraphComponent

The main graph visualization component.

```typescript
<cyng-cytoscape-graph
  [nodes]="nodes()"
  [edges]="edges()"
  [style]="styles()"
  [layoutOptions]="layout()"
  [debug]="true"
  (graphReady)="onReady($event)"
/>
```

**Key Methods:**
- `centerElements(selector: string)` - Center elements matching selector
- `zoomToElement(selector: string, level?: number)` - Zoom to specific element
- `getCytoscapeInstance()` - Get underlying Cytoscape instance

### CytoscapeGraphToolbarComponent

Toolbar with layout and styling controls.

```typescript
<cyng-cytoscape-graph-toolbar
  [(layoutOptions)]="layoutOptions"
  [(styles)]="styles"
  [nodes]="nodes()"
  [edges]="edges()"
  [direction]="'row'"
  (styleSelectorChange)="onSelectorChange($event)"
/>
```

### CytoscapeLayoutToolComponent

Layout configuration with dynamic forms.

```typescript
<cyng-cytoscape-layout-tool
  [(layoutOptions)]="layoutOptions"
/>
```

**Supported Layouts:**
- Grid - Regular grid pattern
- Circle - Circular arrangement
- Concentric - Concentric circles
- Breadth-First - Hierarchical tree
- CoSE - Force-directed
- Dagre - Directed acyclic graph
- Random - Random positions
- Preset - Predefined positions

### FluidFormComponent

**Metadata-based Dynamic Forms** 🎯

A dynamic form generator that creates forms from metadata,
driving the graph options for each graph type. 

```typescript
<cyng-fluid-form
  [(model)]="layoutOptions"
  [formInfo]="formInfo"
/>
```

**Dynamic Form Fetures:**
1. **Type-Safe** - Infers field types from model
2. **Dynamic** - Form changes based on configuration
3. **Reactive** - Two-way binding with signals
4. **Validatable** - Built-in validation support
5. **Conditional** - Shows/hides fields based on model state

## 🏗️ Architecture

### Uses Signals

```typescript
// ✅ Signals for state management
readonly nodes = signal<NodeDefinition[]>([]);

// ✅ Computed values
readonly nodeCount = computed(() => this.nodes().length);

// ✅ Signal-based inputs
readonly debug = input(false);

// ✅ Model signals for two-way binding
readonly layoutOptions = model<LayoutOptions>({...});

// ✅ ViewChild as signals
readonly graph = viewChild<CytoscapeGraphComponent>('graph');
```

###  RxJS Usage

```typescript
// ✅ takeUntilDestroyed for automatic cleanup
effect(() => {
  this.http.get(url)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(...);
});
```

### Standalone Architecture

```typescript
@Component({
  selector: 'cyng-graph',
  standalone: true,  // ✅ No NgModules
  imports: [CommonModule, MatButtonModule],
  ...
})
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Test library
npm run test:lib

# Test demo
npm run test:demo

# CI mode with coverage
npm run test:ci
```

**Test Coverage Includes:**
- Component rendering
- Signal reactivity
- Form generation
- Graph interactions
- Layout algorithms
- Style application

## 📦 Building

```bash
# Build library
npm run build

# Build production library
npm run build:prod

# Watch mode for development
npm run watch
```

## 🎨 Demo Application

Run the sophisticated demo showcasing all features:

```bash
npm start
```

Navigate to `http://localhost:4200`

**Demo Features:**
- Interactive TGF-β biological pathway
- Real-time layout switching
- Dynamic form updates
- Professional styling
- Comprehensive examples

## 🏢 Production Ready

This library includes:

- ✅ Strict TypeScript configuration
- ✅ ESLint with Angular rules
- ✅ Comprehensive test coverage
- ✅ Production build optimization
- ✅ Tree-shakeable exports
- ✅ Proper error handling
- ✅ Accessibility support
- ✅ Documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👨‍💻 Author

**Michael Bushe** - [Mindful Software](https://www.mindfulsoftware.com)

## 🙏 Acknowledgments

- [Cytoscape.js](https://js.cytoscape.org/) - Powerful graph visualization library
- [Angular](https://angular.dev) - Amazing framework
- [Angular Material](https://material.angular.io/) - Beautiful components

---

**Built with ❤️ using Angular 20 by Michael Bushe of Mindful Software**

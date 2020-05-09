# NgCytoscape

 cytoscape-angular is an Angular 9+ component for [Cytoscape](https://js.cytoscape.org/) graphs.
 The component is intended to fully cover the Cytoscape API by providing a
 component that allows every Cytoscape bit to be twiddled and all the properties of the
 graph including layout and styles.  The properties are intended to be fully exposed 
 as visual widgets that can enhance a cytoscape graph on the fly.  In addition to 
 all the layouts that come with cytoscape, the dagre layout for directed graphs is
 included.
 
 ## Usage 
 If you don't have an angular app, create one, it's so easy.  Install and use the
 [Angular CLI](https://github.com/angular/angular-cli)
  
 In a template in your app add the graph 
 
 <mf-cytoscape [nodes]="fooNodes" [edges]="fooEdges"/> 
 
 @Component
 export class FooComponent implements OnInit {
    fooNodes: Nodes[]
    fooEdges: Nodes[]
    
    constructor(public fooService:FooService) {
    }
    
    ngOnInit(): void {
        fooService.fooNodes().subscribe(nodes => this.fooNodes = nodes)
        fooService.fooEdges().subscribe(edges => this.fooEdges = edges)
    }
 }
 
 This library also comes with graph, style and layout UI components that
 update the graph on the fly, see the demo.

Brought to you by Michael Bushe at Mindful Software, michael@mindfulsoftware.com.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1.

## Code scaffolding

Run `ng generate component component-name --project cytoscape-angular` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project cytoscape-angular`.
> Note: Don't forget to add `--project cytoscape-angular` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build cytoscape-angular` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build cytoscape-angular`, go to the dist folder `cd dist/cytoscape-angular` and run `npm publish`.

## Running unit tests

Run `ng test cytoscape-angular` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Cytoscape Angular

 cytoscape-angular is an Angular 12+ component for [Cytoscape](https://cytoscape.org/) graphs.
 The intent is to provide an Angular component that fully covers the Cytoscape API via 
 [cytoscape.js](https://js.cytoscape.org), it's getting close to full coverage.
   
 Other components in the library let users customize a cytoscape graph - toolbar and forms 
 have editors for all the properties of the graph including layout parameters and styles that can enhance 
 a cytoscape graph on the fly.  (Saving the changes are not implemented but should be pretty easy.)
 
 In addition to all the layouts that come with cytoscape.js, cytoscape-angular also adds 
 the dagre layout for directed graphs is included.  Other generic layouts will be supported 
 in a future release.
 
 ## Usage 
 For a full demo see the example-project in this repo.
 To get your own Angular project running with cytoscape-angular:
 - Copy example-project to a new directory
   npm install 
   npm serve
   
Brought to you by [Michael Bushe](michael@mindfulsoftware.com) from [Mindful Software](https://www.mindfulsoftware.com) and [Kaavio](https://www.kaavio.com) .

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building 
`cd dist/cytoscape-angular`
Remove the "pre-publish" lines in dist/cytoscape-angular/package.json
TODO: automate 
Run `npm publish`.

## Running unit tests

Run `ng test cytoscape-angular` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

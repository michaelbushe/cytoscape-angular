# Cytoscape for Angular
Angular component for [Cytoscape](https://cytoscape.org) graphs.  See [demo].(https://cytoscape-angular.web.app)

To use, first create an angular application with the [Angular CLI](https://github.com/angular/angular-cli) 

Then import the CytoscapeGraphModule and use a <cytoscape-graph> element in a template, see the demo code
in projects/cytoscape-angular-demo/src/app/app.component.ts.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.
Using the commands: 

` ng new cytoscape-angular-project --create-application=false -s -t -p mf`

`ng generate application cytoscape-angular-demo`

`ng generate library cytoscape-angular`

## Development server

Run `npm run serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Deploy library to npm
`ng build cytoscape-angular --prod`
`ng build cytoscape-angular-demo --prod`
`ng build cytoscape-angular --prod` (yes, again)
`cd dist/cytoscape-angular`
`npm publish`
`cd ../..`
`firebase deploy`
## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Cytoscape for Angular
Angular component for [Cytoscape](https://cytoscape.org) graphs.  [Demo:](https://cytoscape-angular.web.app)

To use, first create an angular application with the [Angular CLI](https://github.com/angular/angular-cli) 

Then import the CytoscapeGraphModule and use a <cytoscape-graph> element in a template, see the demo code
in projects/cytoscape-angular-demo/src/app/app.component.ts.

## How to Deploy?
How can you deploy your app so other can see it on the web, 
distributing it to caching servers to users around the world
load the app quickly, be able to release a new version and
then rollback to any old version, for free?  Create a new app on
[Google Firebase](console.firebase.google.com)

This demo is deployed on firebase [here](https://cytoscape-angular.firebase-app.com)

Login and create a new firebase app, then in the app's Firebase console click on
"Hosting" and then "Get Started with Hosting" 
follow the directions to install the Firebase CLI. 
On the step to init your app, first build your Angular app with:
 
``ng build --prod``

The build will be in dist/.

Then in a new directory initialize your firebase app:
``firebase login``
``firebase init``

Choose "Hosting: Configure and deploy Firebase Hosting sites" with the spacebar and press enter.

Choose "Use and existing project" with the spacebar, press enter and then when prompted what
to use as the public directory, choose ../dist/ (or perhaps ../dist/(project) if you have a
multi-project angular workspace like this demo + library workspace.)

Keep public as the directory and "Y" to configure as a single-page app.

To test, run:
``firebase deploy``

And you should see the app that firebase creates as a default in the ./public directory
at the url the command displays.

To change the app from ./public, remove the ./public directory and then change the
firebase.json file to point to ./dist/(app) instead of ./public
  "hosting": {
    "public": "dist/cytoscape-angular-demo",
    
Save and again run:
``firebase deploy``
    

CORS Whitelisting - make sure 

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

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

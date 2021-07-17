import { NgModule } from '@angular/core';
import { CytoscapeGraphComponent } from './cytoscape-graph.component'
import { CytoscapeGraphToolbarComponent } from './cytoscape-graph-toolbar/cytoscape-graph-toolbar.component'
import { AutoCompleteModule } from 'primeng/autocomplete'
import {  ButtonModule } from 'primeng/button'
import {  DropdownModule } from 'primeng/dropdown'
import {  FieldsetModule } from 'primeng/fieldset'
import {  InputSwitchModule } from 'primeng/inputswitch'
import { InputTextModule } from 'primeng/inputtext'
import {  OverlayPanelModule } from 'primeng/overlaypanel'
import { ProgressBarModule } from 'primeng/progressbar'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { SpinnerModule  } from 'primeng/spinner'
import {  TooltipModule } from 'primeng/tooltip'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CytoscapeLayoutToolComponent } from './cytoscape-layout-tool/cytoscape-layout-tool.component'
import { CommonModule } from '@angular/common'
import { CytoscapeStyleToolComponent } from './cytoscape-style-tool/cytoscape-style-tool.component'
import { FluidFormComponent } from './fluid-form/fluid-form.component'

@NgModule({
  declarations: [
    CytoscapeGraphComponent,
    CytoscapeGraphToolbarComponent,
    CytoscapeLayoutToolComponent,
    CytoscapeStyleToolComponent,
    FluidFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    FieldsetModule,
    InputSwitchModule,
    InputTextModule,
    OverlayPanelModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    TooltipModule,
    SpinnerModule,
    AutoCompleteModule
  ],
  exports: [
    CytoscapeGraphComponent,
    CytoscapeGraphToolbarComponent,
    CytoscapeLayoutToolComponent,
    CytoscapeStyleToolComponent
  ]
})
export class CytoscapeAngularModule { }

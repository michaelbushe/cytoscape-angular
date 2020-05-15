import { NgModule } from '@angular/core';
import { CytoscapeGraphComponent } from './cytoscape-graph.component'
import { CytoscapeGraphToolbarComponent } from './cytoscape-graph-toolbar/cytoscape-graph-toolbar.component'
import {
  ButtonModule,
  DropdownModule,
  FieldsetModule,
  InputSwitchModule, InputTextModule,
  OverlayPanelModule, ProgressBarModule, ProgressSpinnerModule, SpinnerModule,
  TooltipModule
} from 'primeng'
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
  ],
  exports: [
    CytoscapeGraphComponent,
    CytoscapeGraphToolbarComponent,
    CytoscapeLayoutToolComponent,
    CytoscapeStyleToolComponent
  ]
})
export class CytoscapeAngularModule { }

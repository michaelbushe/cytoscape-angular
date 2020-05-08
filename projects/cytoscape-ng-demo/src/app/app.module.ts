import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CytoscapeNgModule } from 'cytoscape-ng'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  MenubarModule,
  OverlayPanelModule,
  TabViewModule,
  TooltipModule
} from 'primeng';
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    CheckboxModule,
    CytoscapeNgModule,
    HttpClientModule,
    InputTextModule,
    MenubarModule,
    TabViewModule,
    TooltipModule,
    OverlayPanelModule,
    CytoscapeNgModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CytoscapeAngularModule } from 'cytoscape-angular'
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
    CytoscapeAngularModule,
    HttpClientModule,
    InputTextModule,
    MenubarModule,
    TabViewModule,
    TooltipModule,
    OverlayPanelModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

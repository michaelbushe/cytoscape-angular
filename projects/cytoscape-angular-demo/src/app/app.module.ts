import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {ButtonModule} from 'primeng/button'
import {InputTextModule} from 'primeng/inputtext'
import {MenubarModule} from 'primeng/menubar'
import {OverlayPanelModule} from 'primeng/overlaypanel'
import {TabViewModule} from 'primeng/tabview'
import {TooltipModule} from 'primeng/tooltip'
import { HttpClientModule } from '@angular/common/http'
import { CytoscapeAngularModule } from 'cytoscape-angular'
import {CheckboxModule} from 'primeng/checkbox'

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

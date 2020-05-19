import { AfterViewChecked, AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core'
import { Stylesheet, StylesheetStyle } from 'cytoscape'
import { FieldInfo, FieldsetInfo, FormInfo } from '../fluid-form/FormInfo'
import {
  createStyleCoreFormInfo,
  createStyleEdgeFieldSets,
  createStyleNodeFieldSets,
  StylesheetImpl
} from '../style/style'


@Component({
  selector: 'cytoscape-style-tool',
  template: `
    <div>
      <div style="display: flex;">
        <h3 class="style-header">Edit Styles</h3>
      </div>
      <div class="selectors-container">
        <button class="add-button" pButton label="&nbsp;&nbsp;Add&nbsp;&nbsp;"
                [disabled]="!enableAdd" (click)="onAddSelector()"></button>
        <span>&nbsp;&nbsp;</span>
        <label for="selectorDropDown"><a href="https://js.cytoscape.org/#selectors">Selectors</a></label>
        <p-autoComplete #selectorDropDown id="selectorDropDown" class="selector-drop-down"
                        placeholder="Selector"
                        [(ngModel)]="selectedStyleSheet"
                        [suggestions]="selectors"
                        field="selector"
                        dataKey="selector"
                        completeOnFocus="true"
                        dropdown="true"
                        autofocus="true"
                        [style]="{'width':'70%'}"
                        [inputStyle]="{'width':'70%'}"
                        (completeMethod)="search($event)"
                        (ngModelChange)="onSelectorModelChange($event)">
        </p-autoComplete>
      </div>
    </div>
    <hr>
    <div class="apply-div">
      <button class="apply-button" pButton label="Apply" [disabled]="!changed" (click)="onApplyStyle()"></button>
      <span class="selector-span">Selector </span><span>{{selectedStyleSheet.selector}}</span>
    </div>
    <ng-container *ngIf="!selectedStyleSheet">
      <div> Please select a <a href="https://js.cytoscape.org/#selectors">selector</a> above or type a selector name
            and click "Add" to create a new stylesheet for that selector.</div>
    </ng-container>
    <ng-container *ngIf="selectedStyleSheet?.selector?.startsWith('node')">
      <cyng-fluid-form [model]="selectedStyleSheet.style"
                       [formInfo]="nodeFormInfo"
                       (modelChange)="onFormModelChange()">
      </cyng-fluid-form>
    </ng-container>
    <ng-container *ngIf="selectedStyleSheet?.selector?.startsWith('edge')">
      <cyng-fluid-form [model]="selectedStyleSheet.style"
                       [formInfo]="edgeFormInfo"
                       (modelChange)="onFormModelChange()">
      </cyng-fluid-form>
    </ng-container>
    <ng-container *ngIf="selectedStyleSheet?.selector?.startsWith('core')">
      <cyng-fluid-form [model]="selectedStyleSheet.style"
                       [formInfo]="coreFormInfo"
                       (modelChange)="onFormModelChange()">
      </cyng-fluid-form>
    </ng-container>
  `,
  styles: [`
    .selectors-container {
      display: flex;
      align-items: baseline;
      flex-wrap: nowrap;
      flex-grow: 0;
    }

    label[for="selectorDropDown"] {
      font-size: 125%;
      font-weight: bold;
    }

    .selector-drop-down {
      flex-grow: 1;
      padding: 10px;
    }

    .selector-span {
      padding: 10px;
      font-size: 125%;
      font-weight: bold;
    }
    .add-button {

    }
    .apply-button {
    }
  `]
})
export class CytoscapeStyleToolComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  private static CORE_STYLE_FORM_INFO: FormInfo
  @ViewChild('styleForm') styleForm;
  @ViewChild('selectorDropDown') selectorDropDown;

  _styles: StylesheetStyle[]
  enableAdd = false
  private lastValidSelectorModelText: string

  @Input()
  get styles() : StylesheetStyle[] {
    return this._styles
  }
  set styles(styles: StylesheetStyle[]) {
    this._styles = styles
  }
  @Output()
  stylesChange:EventEmitter<StylesheetStyle[]> = new EventEmitter<StylesheetStyle[]>()

  @Output()
  styleSelectorChange: EventEmitter<string> = new EventEmitter<string>()

  nodeFormInfo: FormInfo
  edgeFormInfo: FormInfo
  coreFormInfo: FormInfo

  selectedStyleSheet: StylesheetStyle
  selectors: StylesheetStyle[]
  changed = false

  constructor() {
  }

  ngOnInit(): void {
    this.coreFormInfo = CytoscapeStyleToolComponent.createStyleFormInfo()
    this.nodeFormInfo = new FormInfo('Node', createStyleNodeFieldSets())
    this.edgeFormInfo = new FormInfo('Edge', createStyleEdgeFieldSets())
    if (!this.styles) {
      this.styles = [new StylesheetImpl()]
    }
    this.setSelectorsFromStyles(null)
    this.selectedStyleSheet = this.selectors[0]
    console.log(`this.selectors.length:`, this.selectors.length)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges style changes:', JSON.stringify(changes))
    if (changes['styles']) {
      this.setSelectorsFromStyles(null)
      this.selectedStyleSheet = this.selectors[0]
      console.log(`styles updated this.selectors.length:`, this.selectors.length)
    }
  }

  ngAfterViewInit(): void {
    // console.debug("ngAfterViewInit")
  }

  ngAfterViewChecked(): void {
    // console.debug("ngAfterViewChecked")
  }

  onFormModelChange() {
    console.log('onFormModelChange')
    this.changed = true
  }

  onApplyStyle() {
    this.changed = false
    this.stylesChange.emit(this.styles)
  }

  search(event) {
    let searchString = event.query
    this.setSelectorsFromStyles(searchString)
  }

  private setSelectorsFromStyles(searchString: string) {
    this.selectors = this.styles.filter((stylesheet: StylesheetStyle) => {
      return searchString ? stylesheet.selector.includes(searchString) : true
    })
  }

  private static createStyleFormInfo(): FormInfo {
    if (!CytoscapeStyleToolComponent.CORE_STYLE_FORM_INFO) {
      CytoscapeStyleToolComponent.CORE_STYLE_FORM_INFO = createStyleCoreFormInfo()
    }
    return CytoscapeStyleToolComponent.CORE_STYLE_FORM_INFO
  }

  onAddSelector() {
    const newStylesheetStyle: StylesheetStyle = new StylesheetImpl()
    newStylesheetStyle.selector = this.lastValidSelectorModelText
    console.log('Adding new style with selector:', this.lastValidSelectorModelText)
    this.styles.unshift(newStylesheetStyle)
    this.selectedStyleSheet = newStylesheetStyle
  }

  /*
   * The param can be a selector object when the user selects a stylesheet entry from the dropdown and changes the
   * selection (which will fire a selection change to let the graph, say, focus on the selected node).
   * or the param is text if the user is just typing in the field, which doens't change the selector untl the user
   * clicks Add.
   */
  onSelectorModelChange(param: any) {
    console.log(`selectorModelChanged:${JSON.stringify(param)}`)
    const selector = param.selector ? param.selector : param
    const stylesheet = param.selector ? param : this.getStylesheetForSelector(selector)
    if (stylesheet) {
      if (this.changed) {
        this.onApplyStyle()
      }
      this.styleSelectorChange.emit(selector)
    } else {
      this.enableAdd =  this.isValidSelector(selector)
      if (this.enableAdd) {
        this.lastValidSelectorModelText = selector
      } else {
        this.lastValidSelectorModelText = null
      }
    }
  }

  getStylesheetForSelector(selectorName): Stylesheet {
    this.selectors.forEach(selector => {
      if (selector.selector === selectorName) {
        return selector
      }
    })
    return null
  }

  isValidSelector(text: string) {
    console.log('isValidSelector:', text)
    if (text?.startsWith('node') || text?.startsWith('edge') || text?.startsWith('core')) {
      const openBracket = text.indexOf('[')
      if (openBracket > -1) {
        if (text.indexOf(']') < openBracket) {
          return false
        }
      }
      const openQuote = text.indexOf('\'')
      if (openQuote > -1) {
        let closeQuote = text.indexOf('\'', openQuote +1)
        if (closeQuote < openQuote) {
          return false
        }
      }
      return true
    }
    return false
  }
}

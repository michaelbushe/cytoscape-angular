import { StylesheetStyle } from 'cytoscape'
import { FieldInfo, FieldsetInfo, FieldType, FormInfo } from '../fluid-form/FormInfo'

class StyleFieldInfo extends FieldInfo {
  constructor(styleName: string, type: FieldType, hint: string, options?: object[] | string) {
    super(styleName, styleName, type, hint)
    this.options = options
  }

  fieldType(model: object): FieldType {
    switch (this.type) {
      case 'percent' :
        return 'number'
      case 'ShapePolygonPoints':
      case 'NodeShape':
      case 'LineStyle':
      case 'TextTranformation':
      case 'FontStyle':
      case 'FontWeight':
      case 'Colour':
        return 'string'
      default:
        return super.fieldType(model)
    }
  }
}

export function createStyleCoreFormInfo() {
  return new FormInfo('Core Styles',
    [
      new FieldsetInfo('Background', [
        new StyleFieldInfo('active-bg-color', 'Colour',
          'The colour of the indicator shown when the background is grabbed by the user.'),
        new StyleFieldInfo('active-bg-opacity', 'number',
          'The opacity of the active background indicator.'),
        new StyleFieldInfo('active-bg-size', 'number',
          'The size of the active background indicator..')
      ]),

      new FieldsetInfo('Selection Box', [
        new StyleFieldInfo('selection-box-color', 'Colour',
          'The background colour of the selection box used for drag selection.'),
          new StyleFieldInfo('selection-box-border-color', 'Colour',
            'The colour of the border of the selection box used for drag selection.'),
          new StyleFieldInfo('selection-box-border-width', 'number',
            'The size of the border on the selection box.'),
          new StyleFieldInfo('selection-box-opacity', 'number',
          'The opacity of the selection box.'),
        new StyleFieldInfo('', 'number',
          '')
      ]),
      new FieldsetInfo('Texture During Viewport Gestures', [
        new StyleFieldInfo('outside-texture-bg-color', 'Colour',
          'The colour of the area outside the viewport texture when initOptions.textureOnViewport === true.'),
        new StyleFieldInfo('outside-texture-bg-opacity', 'number',
          'The opacity of the area outside the viewport texture.'),
      ]),
    ], false)
}

function fieldSorter(field1: FieldInfo, field2: FieldInfo): number {
  if (!field1) {
    return field2 ? 1: 0
  } else if (!field2) {
    return -1
  } else {
    const label1 = typeof field1.label === 'function' ? field1.label() : field1.label
    const label2 = typeof field2.label === 'function' ? field2.label() : field2.label
    return label1.localeCompare(label2);
  }
}

export function createStyleNodeFieldSets() {
  const fieldsetInfos: FieldsetInfo[] = []

  let nodeFieldInfos: FieldInfo[] = []
  nodeFieldInfos.push(new StyleFieldInfo('label', 'string', 'The text to display for an element’s label.'))
  nodeFieldInfos.push(new StyleFieldInfo('source-label', 'string', 'The text to display for a node’s source label.'))
  nodeFieldInfos.push(new StyleFieldInfo('target-label', 'string', 'The text to display for a node’s target label.'))
  nodeFieldInfos.push(new StyleFieldInfo('color', 'Colour', 'The colour of the element’s label.'))
  nodeFieldInfos.push(new StyleFieldInfo('font-family', 'string', 'A comma-separated list of font names to use on the label text.'))
  /**
   * https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
   */
  nodeFieldInfos.push(new StyleFieldInfo('font-size', 'string', 'The size of the label text.'))
  /**
   * https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
   */
  nodeFieldInfos.push(new StyleFieldInfo('font-style', 'FontStyle', 'A CSS font style to be applied to the label text.'))
  nodeFieldInfos.push(new StyleFieldInfo('font-weight', 'FontWeight', 'A CSS font weight to be applied to the label text.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-max-width', 'string', 'The maximum width for wrapped text, applied when "text-wrap" is set to wrap. For only manual newlines (i.e.\\n), set a very large value like 1000px such that only your newline characters would apply.'))
  let textWrapStyleFieldInfo = new StyleFieldInfo('text-wrap', 'options',
    'A wrapping style to apply to the label text; may be "none" for no wrapping (including manual newlines ) or "wrap" for manual and/ or autowrapping.')
  textWrapStyleFieldInfo.options = [
    {label: 'none', value: 'none'},
    {label: 'wrap', value: 'wrap'},
    {label: 'ellipsis', value: 'ellipsis'}
    ]
  nodeFieldInfos.push(textWrapStyleFieldInfo)
  /**
   * Node label alignment:
   */
  nodeFieldInfos.push(new StyleFieldInfo('text-halign', 'options',
    'The vertical alignment of a node’s label.', [
      {name: '', label: ''},
      {label: 'left', value: 'left'},
      {label: 'center', value: 'center'},
      {labe: 'right', value: 'right'}]))
  nodeFieldInfos.push(new StyleFieldInfo('text-valign', 'options',
    'The vertical alignment of a node’s label.', [
      {name: '', label: ''},
      {label: 'top', value: 'top'},
      {label: 'center', value: 'center'},
      {label: 'bottom', value: 'bottom'}]))
  nodeFieldInfos.push(new StyleFieldInfo('text-opacity', 'number', 'The opacity of the label text, including its outline.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-transform', 'TextTranformation', 'A transformation to apply to the label text.'))
  fieldsetInfos.push(new FieldsetInfo('Label', nodeFieldInfos))
  nodeFieldInfos = []

  nodeFieldInfos.push(new StyleFieldInfo('content', 'string', 'The CSS content field'))
  nodeFieldInfos.push(new StyleFieldInfo('width', 'string', 'The width of the node’s body. This property can take on the special value label so the width is automatically based on the node’s label.'))
  nodeFieldInfos.push(new StyleFieldInfo('height', 'string', 'The height of the node’s body. This property can take on the special value label so the height is automatically based on the node’s label.'))
  nodeFieldInfos.push(new StyleFieldInfo('background-color', 'Colour', 'The colour of the node’s body.'))
  nodeFieldInfos.push(new StyleFieldInfo('background-blacken', 'number', '   Blackens the node’s body for values from 0 to 1; whitens the node’s body for values from 0 to -1.'))
  nodeFieldInfos.push(new StyleFieldInfo('background-opacity', 'number', 'The opacity level of the node’s background colour.'))
  nodeFieldInfos.push(new StyleFieldInfo('border-width', 'string', 'The size of the node’s border.'))
  nodeFieldInfos.push(new StyleFieldInfo('border-style', 'LineStyle', 'The style of the node’s border.'))
  nodeFieldInfos.push(new StyleFieldInfo('border-color', 'Colour', 'The colour of the node’s border.'))
  nodeFieldInfos.push(new StyleFieldInfo('border-opacity', 'percent', 'The opacity of the node’s border. A value between [0 1].'))
  nodeFieldInfos.push(new StyleFieldInfo('shape', 'NodeShape', 'The shape of the node’s body.'))
  nodeFieldInfos.push(new StyleFieldInfo('shape-polygon-points', 'ShapePolygonPoints', ''))
  nodeFieldInfos.push(new StyleFieldInfo('overlay-color', 'Colour', 'The colour of the overlay on top of nodes or edges.'))
  nodeFieldInfos.push(new StyleFieldInfo('overlay-padding', 'string', 'The area outside of the element within which the overlay is shown.'))
  nodeFieldInfos.push(new StyleFieldInfo('overlay-opacity', 'number', 'The opacity of the overlay.'))
  nodeFieldInfos.push(new StyleFieldInfo('padding-left', 'string', '   Padding increases node dimensions by adding spacing around the label of nodes whose heights and widths are the value \'label\', or it can be used to add spacing between a compound node parent and its children.'))
  nodeFieldInfos.push(new StyleFieldInfo('padding-right', 'string', '   Padding increases node dimensions by adding spacing around the label of nodes whose heights and widths are the value \'label\', or it can be used to add spacing between a compound node parent and its children.'))
  nodeFieldInfos.push(new StyleFieldInfo('padding-top', 'string', '   Padding increases node dimensions by adding spacing around the label of nodes whose heights and widths are the value \'label\', or it can be used to add spacing between a compound node parent and its children.'))
  nodeFieldInfos.push(new StyleFieldInfo('padding-bottom', 'string', '   Padding increases node dimensions by adding spacing around the label of nodes whose heights and widths are the value \'label\', or it can be used to add spacing between a compound node parent and its children.'))
  fieldsetInfos.push(new FieldsetInfo('Node', nodeFieldInfos))
  nodeFieldInfos = []

  /**
   * Edge label alignment:
   */
  nodeFieldInfos.push(new StyleFieldInfo('source-text-offset', 'number', 'For the source label of an edge, how far from the source node the label should be placed.'))
  nodeFieldInfos.push(new StyleFieldInfo('target-text-offset', 'number', 'For the target label of an edge, how far from the target node the label should be placed.'))
  /**
   * Margins:
   */
  nodeFieldInfos.push(new StyleFieldInfo('text-margin-x', 'number', 'A margin that shifts the label along the x- axis.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-margin-y', 'number', 'A margin that shifts the label along the y- axis.'))
  nodeFieldInfos.push(new StyleFieldInfo('source-text-margin-x', 'number', '(For the source label of an edge.)'))
  nodeFieldInfos.push(new StyleFieldInfo('source-text-margin-y', 'number', '(For the source label of an edge.)'))
  nodeFieldInfos.push(new StyleFieldInfo('target-text-margin-x', 'number', '(For the target label of an edge.)'))
  nodeFieldInfos.push(new StyleFieldInfo('target-text-margin-y', 'number', '(For the target label of an edge.)'))
  /**
   * Rotating text:
   */
  nodeFieldInfos.push(new StyleFieldInfo('text-rotation', 'number', 'A rotation angle that is applied to the label. For edges, the special value autorotate can be used to align the label to the edge. For nodes, the label is rotated along its anchor point on the node, so a label margin may help for some usecases. The special value none can be used to denote 0deg. Rotations works best with left- to - right text.'))
  nodeFieldInfos.push(new StyleFieldInfo('source-text-rotation', 'number', '(For the source label of an edge.)'))
  nodeFieldInfos.push(new StyleFieldInfo('target-text-rotation', 'number', '(For the target label of an edge.)'))
  /**
   * Outline:
   */
  nodeFieldInfos.push(new StyleFieldInfo('text-outline-color', 'Colour', 'The colour of the outline around the element’s label text.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-outline-opacity', 'number', 'The opacity of the outline on label text.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-outline-width', 'string', 'The size of the outline on label text.'))
  /**
   * Shadow:
   */
  nodeFieldInfos.push(new StyleFieldInfo('text-shadow-blur', 'number', 'The shadow blur distance.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-shadow-color', 'Colour', 'The colour of the shadow.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-shadow-offset-x', 'number', 'The x offset relative to the text where the shadow will be displayed, can be negative.  If you set blur to 0, add an offset to view your shadow.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-shadow-offset-y', 'number', 'The y offset relative to the text where the shadow will be displayed, can be negative.  If you set blur to 0, add an offset to view your shadow.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-shadow-opacity', 'number', 'The opacity of the shadow on the text; the shadow is disabled for 0 (default value).'))
  /**
   * Background:
   */
  nodeFieldInfos.push(new StyleFieldInfo('text-background-padding', 'string', 'The padding provides visual spacing between the text and the edge of the background.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-background-color', 'Colour', 'A colour to apply on the text background.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-background-opacity', 'number', 'The opacity of the label background; the background is disabled for 0 (default value).'))
  nodeFieldInfos.push(new StyleFieldInfo('text-background-shape', 'options',
    'The shape to use for the label background.', [
      {name: '', label: ''},
      {label: 'rectangle', value: 'rectangle'},
      {label: 'roundrectangle', value: 'roundrectangle'}
    ]))
  nodeFieldInfos.push(new StyleFieldInfo('text-border-opacity', 'number', 'The width of the border around the label; the border is disabled for 0 (default value).'))
  nodeFieldInfos.push(new StyleFieldInfo('text-border-width', 'number', 'The width of the border around the label.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-border-style', 'LineStyle', 'The style of the border around the label.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-border-color', 'Colour', 'The colour of the border around the label.'))
  fieldsetInfos.push(new FieldsetInfo('Advanced Text', nodeFieldInfos))
  nodeFieldInfos = []

  /**
   * Interactivity:
   */
  nodeFieldInfos.push(new StyleFieldInfo('min-zoomed-font-size', 'number', 'If zooming makes the effective font size of the label smaller than this, then no label is shown.Note that because of performance optimisations, the label may be shown at font sizes slightly smaller than this value. This effect is more pronounced at larger screen pixel ratios. However, it is guaranteed that the label will be shown at sizes equal to or greater than the value specified.'))
  nodeFieldInfos.push(new StyleFieldInfo('text-events', 'options',
    'Whether events should occur on an element if the label receives an event. You may want a style applied to the text onactive so you know the text is activatable.', [
      {label: 'yes', value: 'yes'},
      {label: 'no', value: 'no'}
    ]))
  fieldsetInfos.push(new FieldsetInfo('Interactivity', nodeFieldInfos))
  return fieldsetInfos
}

/**
 * Defaults to a blank node
 */
export class StylesheetImpl implements StylesheetStyle {
  constructor(
    public selector: string = 'node',
    public style: cytoscape.Css.Node | cytoscape.Css.Edge | cytoscape.Css.Core = {}
  ) {
  }
}

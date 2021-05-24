import * as isFieldType from './isFieldType'
import * as commonGetters from './commonGetters'
import * as mergeSchema from './mergeSchema'
import * as callbackGetters from './callbackGetters'
import * as miscGetters from './miscGetters'
import { _getModelOverride, _getFieldOverride } from './componentOverrides'
import type {
  BasicFieldType,
  CallbackProps,
  DisplayCondition,
  DisplayConditions,
  Field,
  Fields,
  RelFieldType,
  Schema,
  SchemaJSON
} from './schemaJson'
import { FormStack } from './formstack'

/* Notes:

1.) The objects exported from conveyor-schema are:

  * getters for schema keys

  * helpers for merging schema defaults

  * helpers for creating string displayValues

  * field types

Do NOT export:

  * helpers for traversing redux/node/data objects (editData, modalData, formStack);
  (with some exceptions such as isFieldDisabled, where is unavoidable)

  * helpers for logic specific to conveyor (unless necessary outside conveyor)

2.) Do not import local functions into any file other than /schemaBuilder
or /index (inputTypes are ok). Instead, always call a function from schema:

DO:
  schema.foo(modelName)
NOT DO:
  foo(schema, modelName)

3.) Pass the entire SchemaBuilder ('schema') object into methods that have a callback.
For example, 'isCreatable' calls the 'creatable' func defined in the schema. 'creatable'
needs the entire SchemaBuilder passed into it to allow users access to methods:

  export const _isCreatable = ({ schema, modelName, parentNode, data, customProps }) => {
    // schema needed for 'getModel'
    const creatable = R.propOr(true, 'creatable', schema.getModel(modelName))
      // pass schema into callback
      return creatable({ schema, modelName, parentNode, data, customProps })

The json object (this.schemaJSON) can be passed into 'dead-end' schemaGetters w/o callbacks.

4.) Destructured Function Parameter

Functions with callbacks get passed a dictionary of props, ie. { modelName, node, }.
They also get passed the 'customProps' attribute:

   getDisplayValue({ modelName, node, customProps })

Simple functions with few args & no callback get passed props explicitly:

   getField(modelName, fieldName)

Callback functions (stored in schemaJSON) always get passed an object passed in:

   // runs callback function for getDisplayValue()
   return displayField({ schema, modelName, node, customProps })

5.) Avoid exporting helper functions which contradict the methods already in 'SchemaBuilder'.

For example, 'isSortable' does 3 things: a.) looks for the 'sortable' prop in the schema,
b.) evaluates it, c.) returns default if necessary.

Do NOT export any other 'sortable'-like helper function to SchemaBuilder which does only
ONE of those three things (or does something different) as it will confuse the user without
advanced knowledge of the library. Names of SchemaBuilder methods should not be confusing or
too similar, or require copious explanation/ differentiation.

* */

export type SchemaBuilderType = SchemaBuilder //why???

export interface NodeType {
  __typename: string
  [key: string]: unknown
}

export class SchemaBuilder {
  public schemaJSON: SchemaJSON

  constructor(schemaJSON: SchemaJSON) {
    this.schemaJSON = schemaJSON
  }

  // merge remote schema or default props

  mergeSchema(remoteSchema: SchemaJSON, override = false): void {
    mergeSchema._mergeSchema(this, remoteSchema, override)
  }
  mergeDefaultModelAttr(
    getDefaultModelProps: (props: {
      schema: SchemaBuilder
      model: Schema
    }) => Partial<Schema>,
    override = false
  ): void {
    mergeSchema._mergeDefaultModelAttr(this, getDefaultModelProps, override)
  }
  mergeDefaultFieldAttr(
    getDefaultFieldProps: ({
      schema,
      model,
      field
    }: {
      schema: SchemaBuilderType
      model: Schema
      field: Field
    }) => Field,
    override = false
  ): void {
    mergeSchema._mergeDefaultFieldAttr(this, getDefaultFieldProps, override)
  }

  // common name/title getters

  getDisplayValue({
    modelName,
    node,
    customProps
  }: {
    modelName: string
    node?: NodeType
    customProps?: Record<string, unknown>
  }): string {
    return commonGetters._getDisplayValue({
      schema: this,
      modelName,
      node,
      customProps
    })
  }

  getNoDataDisplayValue({
    modelName,
    fieldName,
    node,
    customProps
  }: {
    modelName: string
    fieldName: string
    node?: NodeType
    customProps?: Record<string, unknown>
  }): string {
    return commonGetters._getNoDataDisplayValue({
      schema: this,
      modelName,
      fieldName,
      node,
      customProps
    })
  }

  getFieldLabel({
    modelName,
    fieldName,
    node,
    data,
    customProps
  }: {
    modelName: string
    fieldName: string
    node?: NodeType
    data?: NodeType[]
    customProps?: Record<string, unknown>
  }): string {
    return commonGetters._getFieldLabel({
      schema: this,
      modelName,
      fieldName,
      node,
      data,
      customProps
    })
  }

  getModelLabel({
    modelName,
    node,
    data,
    customProps
  }: {
    modelName: string
    node?: NodeType
    data?: NodeType[]
    customProps?: Record<string, unknown>
  }): string {
    return commonGetters._getModelLabel({
      schema: this,
      modelName,
      node,
      data,
      customProps
    })
  }

  getModelLabelPlural({
    modelName,
    data,
    customProps
  }: {
    modelName: string
    data?: NodeType[]
    customProps?: Record<string, unknown>
  }): string {
    return commonGetters._getModelLabelPlural({
      schema: this,
      modelName,
      data,
      customProps
    })
  }

  // common getters

  getModel(modelName: string): Schema {
    // TODO: REMOVE WHEN CONVEYOR USES TYPESCRIPT
    return this.schemaJSON[modelName] ?? {}
  }
  // this function should not exist!!
  getModelAttribute(
    modelName: string,
    attributeName: string
  ): Schema[keyof Schema] {
    return this.getModel(modelName)?.[attributeName]
  }
  getActions(modelName: string): Schema['actions'] {
    return this.getModel(modelName)?.actions
  }
  getFields(modelName: string): Fields {
    return this.getModel(modelName)?.fields
  }
  getField(modelName: string, fieldName: string): Field | undefined {
    return this.getFields(modelName)?.[fieldName]
  }
  getType(
    modelName: string,
    fieldName: string
  ): BasicFieldType | RelFieldType | undefined {
    return commonGetters._getType(this, modelName, fieldName)
  }
  getEnumLabel(
    modelName: string,
    fieldName: string,
    value?: string
  ): string | undefined {
    return commonGetters._getEnumLabel(this, modelName, fieldName, value)
  }

  // callback getters

  /**
   * Checks `editable` for every object in the `data` prop => calls isRowEditable
   * @param modelName the associated model name
   * @param data list of nodes
   * @param parentNode node of the parent object whose page the child node is on
   * @param fieldOrder list of field names of the table
   */
  isTableEditable({
    modelName,
    data,
    parentNode,
    fieldOrder,
    customProps
  }: {
    modelName: string
    data: NodeType[]
    parentNode?: NodeType
    fieldOrder?: string[]
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isTableEditable({
      schema: this,
      modelName,
      data,
      parentNode,
      fieldOrder,
      customProps
    })
  }
  /**
   * Checks `editable` for every object in the `node` prop => calls isFieldEditable
   * @param modelName the associated model name
   * @param node database object that is to be displayed
   * @param parentNode node of the parent object whose page the child node is on
   * @param fieldOrder list of field names of the table
   */
  isRowEditable({
    modelName,
    node,
    parentNode,
    fieldOrder,
    customProps
  }: {
    modelName: string
    node: NodeType
    parentNode?: NodeType
    fieldOrder?: string[]
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isRowEditable({
      schema: this,
      modelName,
      node,
      parentNode,
      fieldOrder,
      customProps
    })
  }
  /**
   * Checks `editable` on field level
   * @param modelName the associated model name
   * @param fieldName the associated field name
   * @param node database object that is to be displayed
   * @param parentNode node of the parent object whose page the child node is on
   * @param fieldOrder list of field names of the table
   */
  isFieldEditable({
    modelName,
    fieldName,
    node,
    parentNode,
    customProps
  }: {
    modelName: string
    fieldName: string
    node?: NodeType
    parentNode?: NodeType
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isFieldEditable({
      schema: this,
      modelName,
      fieldName,
      node,
      parentNode,
      customProps
    })
  }
  /**
   * Checks `deletable` for every object in the `data` prop => calls isDeletable
   * @param modelName the associated model name
   * @param data list of nodes
   * @param parentNode node of the parent object whose page the child node is on
   */
  isTableDeletable({
    modelName,
    data,
    parentNode,
    customProps
  }: {
    modelName: string
    data: NodeType[]
    parentNode?: NodeType
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isTableDeletable({
      schema: this,
      modelName,
      data,
      parentNode,
      customProps
    })
  }
  /**
   * Checks `deletable` on model level
   * @param modelName the associated model name
   * @param node database object that is to be displayed
   * @param parentNode node of the parent object whose page the child node is on
   */
  isDeletable({
    modelName,
    node,
    parentNode,
    customProps
  }: {
    modelName: string
    node?: NodeType
    parentNode?: NodeType
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isDeletable({
      schema: this,
      modelName,
      node,
      parentNode,
      customProps
    })
  }
  /**
   * Checks `creatable` on model level
   * @param modelName the associated model name
   * @param data list of nodes
   * @param parentNode node of the parent object whose page the child node is on
   */
  isCreatable({
    modelName,
    parentNode,
    data,
    customProps
  }: {
    modelName: string
    parentNode?: NodeType
    data?: NodeType[]
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isCreatable({
      schema: this,
      modelName,
      parentNode,
      data,
      customProps
    })
  }
  /**
   * Applies displayCondition function for given field
   * @param modelName the associated model name
   * @param fieldName the associated field name
   * @param node database object that is to be displayed
   * @param displayCondition function indicating if a given field should display
   */
  shouldDisplay({
    modelName,
    fieldName,
    node,
    displayCondition,
    customProps
  }: Omit<CallbackProps, 'schema'> & {
    node?: NodeType
    displayCondition?: DisplayCondition
  }): boolean {
    return callbackGetters._shouldDisplay({
      schema: this,
      modelName,
      fieldName,
      node,
      displayCondition,
      customProps
    })
  }
  /**
   * Applies index displayCondition for given field
   * @param modelName the associated model name
   * @param fieldName the associated field name
   * @param node database object that is to be displayed
   */
  shouldDisplayIndex({
    modelName,
    fieldName,
    node,
    customProps
  }: {
    modelName: string
    fieldName: string
    node?: NodeType
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._shouldDisplayIndex({
      schema: this,
      modelName,
      fieldName,
      node,
      customProps
    })
  }
  /**
   * Applies detail displayCondition for given field
   * @param modelName the associated model name
   * @param fieldName the associated field name
   * @param node database object that is to be displayed
   */
  shouldDisplayDetail({
    modelName,
    fieldName,
    node,
    customProps
  }: {
    modelName: string
    fieldName: string
    node?: NodeType
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._shouldDisplayDetail({
      schema: this,
      modelName,
      fieldName,
      node,
      customProps
    })
  }
  /**
   * Applies create displayCondition for given field
   * @param modelName the associated model name
   * @param fieldName the associated field name
   * @param node database object that is to be displayed
   */
  shouldDisplayCreate({
    modelName,
    fieldName,
    node,
    customProps
  }: {
    modelName: string
    fieldName: string
    node?: NodeType
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._shouldDisplayCreate({
      schema: this,
      modelName,
      fieldName,
      node,
      customProps
    })
  }
  /**
   * Checks `disabled` on field level OR checks formStack for `disabled` flag on field
   * @param modelName the associated model name
   * @param fieldName the associated field name
   * @param formStack conveyor-redux's formStack object, holding the 'create' form data
   */
  isFieldDisabled({
    modelName,
    fieldName,
    formStack,
    customProps
  }: {
    modelName: string
    fieldName: string
    formStack: FormStack
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isFieldDisabled({
      schema: this,
      modelName,
      fieldName,
      formStack,
      customProps
    })
  }
  /**
   * Checks `sortable` on field level => does NOT check 'sortable' on model level, must call isTableSortable as well for full coverage
   * @param modelName the associated model name
   * @param fieldName the associated field name
   */
  isSortable({
    modelName,
    fieldName,
    customProps
  }: {
    modelName: string
    fieldName: string
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isSortable({
      schema: this,
      modelName,
      fieldName,
      customProps
    })
  }
  /**
   * Checks `sortable` on model level => also calls isSortable for every fieldName in model's `fieldOrder`
   * @param modelName the associated model name
   */
  isTableSortable({
    modelName,
    customProps
  }: {
    modelName: string
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isTableSortable({
      schema: this,
      modelName,
      customProps
    })
  }
  /**
   * Checks `filterable` on field level => does NOT check `filterable` on model level, must call isTableFilterable as well for full coverage
   * @param modelName the associated model name
   * @param fieldName the associated field name
   * @param data list of nodes
   * @param parentNode node of the parent object whose page the child node is on
   */
  isFilterable({
    modelName,
    fieldName,
    data,
    customProps
  }: {
    modelName: string
    fieldName: string
    data?: NodeType[]
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isFilterable({
      schema: this,
      modelName,
      fieldName,
      data,
      customProps
    })
  }
  /**
   * Checks `filterable` on model level => also calls isFilterable for every fieldName listed in model's `fieldOrder`
   * @param modelName the associated model name
   * @param data list of nodes
   * @param parentNode node of the parent object whose page the child node is on
   */
  isTableFilterable({
    modelName,
    data,
    customProps
  }: {
    modelName: string
    data?: NodeType[]
    customProps?: Record<string, unknown>
  }): boolean {
    return callbackGetters._isTableFilterable({
      schema: this,
      modelName,
      data,
      customProps
    })
  }
  /**
   * Called by getDetailFields, getIndexFields, and getCreateFields internally
   */
  getShownFields({
    modelName,
    type,
    node,
    data,
    customProps
  }: {
    modelName: string
    type: string
    node?: NodeType
    data?: NodeType[]
    customProps?: Record<string, unknown>
  }): string[] {
    return callbackGetters._getShownFields({
      schema: this,
      modelName,
      type,
      node,
      data,
      customProps
    })
  }
  /**
   * Checks `detailFieldOrder` on model level OR fetches all fields with `showDetail` boolean true OR `showDetail` function evaluate to true
   * @param modelName the associated model name
   * @param node database object that is to be displayed
   */
  getDetailFields({
    modelName,
    node,
    customProps
  }: {
    modelName: string
    node?: NodeType
    customProps?: Record<string, unknown>
  }): string[] {
    return callbackGetters._getDetailFields({
      schema: this,
      modelName,
      node,
      customProps
    })
  }
  /**
   * Checks `indexFieldOrder` on model level OR fetches all fields with `showIndex` boolean true OR `showIndex` function evaluate to true
   * @param modelName the associated model name
   * @param data list of nodes
   */
  getIndexFields({
    modelName,
    data,
    customProps
  }: {
    modelName: string
    data?: NodeType[]
    customProps?: Record<string, unknown>
  }): string[] {
    return callbackGetters._getIndexFields({
      schema: this,
      modelName,
      data,
      customProps
    })
  }
  /**
   * Checks `createFieldOrder` on model level OR fetches all fields with `showCreate` boolean true OR `showCreate` function evaluate to true
   * @param modelName the associated model name
   */
  getCreateFields({
    modelName,
    customProps
  }: {
    modelName: string
    customProps?: Record<string, unknown>
  }): string[] {
    return callbackGetters._getCreateFields({
      schema: this,
      modelName,
      customProps
    })
  }
  /**
   * Checks `tooltipFieldOrder` on model level OR fetches all fields with `showTooltip` boolean true OR `showTooltip` function evaluate to true
   * @param modelName the associated model name
   */
  getTooltipFields({
    modelName,
    customProps
  }: {
    modelName: string
    customProps?: Record<string, unknown>
  }): string[] {
    return callbackGetters._getTooltipFields({
      schema: this,
      modelName,
      customProps
    })
  }
  /**
   * Applies `disabledDropDown` on field level
   *
   *
   *
   * @param modelName the associated model name
   * @param fieldName the associated field name
   * @param options list of values with format {label: 'foo', value: 'bar'}
   * @param value current value selected in the dropdown
   */
  getOptionsOverride({
    modelName,
    fieldName,
    options,
    value,
    customProps
  }: {
    modelName: string
    fieldName: string
    options: Array<{ label: string; value: unknown }>
    value?: { disabled: boolean; label: string; value: unknown }
    customProps?: Record<string, unknown>
  }): boolean | Array<{ label: string; value: unknown }> {
    return callbackGetters._getOptionsOverride({
      schema: this,
      modelName,
      fieldName,
      options,
      value,
      customProps
    })
  }

  // misc getters

  getFieldConditions(
    modelName: string,
    fieldName: string
  ): DisplayConditions | undefined {
    return miscGetters._getFieldConditions(this, modelName, fieldName)
  }
  getFieldDisableCondition(
    modelName: string,
    fieldName: string
  ): Field['disabled'] {
    return miscGetters._getFieldDisableCondition(this, modelName, fieldName)
  }
  getDropDownDisableCondition(
    modelName: string,
    fieldName: string
  ): Field['disabledDropDown'] {
    return miscGetters._getDropDownDisableCondition(this, modelName, fieldName)
  }
  getFieldHelpText(modelName: string, fieldName: string): string | null {
    return miscGetters._getFieldHelpText(this, modelName, fieldName)
  }
  getRequiredFields(modelName: string): string[] {
    return miscGetters._getRequiredFields(this, modelName)
  }
  getHasIndex(modelName: string): boolean {
    return miscGetters._getHasIndex(this, modelName)
  }
  getHasDetail(modelName: string): boolean {
    return miscGetters._getHasDetail(this, modelName)
  }
  getSingleton(modelName: string): boolean {
    return miscGetters._getSingleton(this, modelName)
  }
  getEnumChoices(modelName: string, fieldName: string): Field['choices'] {
    return miscGetters._getEnumChoices(this, modelName, fieldName)
  }
  getEnumChoiceOrder(
    modelName: string,
    fieldName: string
  ): Field['choiceOrder'] {
    return miscGetters._getEnumChoiceOrder(this, modelName, fieldName)
  }
  getCollapsable(modelName: string, fieldName: string): boolean {
    return miscGetters._getCollapsable(this, modelName, fieldName)
  }
  getSearchable(modelName: string): boolean {
    return miscGetters._getSearchable(this, modelName)
  }
  getTableLinkField(modelName: string, fieldOrder: []): string | null {
    return miscGetters._getTableLinkField(this, modelName, fieldOrder)
  }
  getTableFields(modelName: string, fieldName: string): string[] {
    return miscGetters._getTableFields(this, modelName, fieldName)
  }

  // isFieldType

  isOneToMany(modelName: string, fieldName: string): boolean {
    return isFieldType._isOneToMany(this.schemaJSON, modelName, fieldName)
  }
  isManyToMany(modelName: string, fieldName: string): boolean {
    return isFieldType._isManyToMany(this.schemaJSON, modelName, fieldName)
  }
  isManyToOne(modelName: string, fieldName: string): boolean {
    return isFieldType._isManyToOne(this.schemaJSON, modelName, fieldName)
  }
  isOneToOne(modelName: string, fieldName: string): boolean {
    return isFieldType._isOneToOne(this.schemaJSON, modelName, fieldName)
  }
  isRel(modelName: string, fieldName: string): boolean {
    return isFieldType._isRel(this.schemaJSON, modelName, fieldName)
  }
  isString(modelName: string, fieldName: string): boolean {
    return isFieldType._isString(this.schemaJSON, modelName, fieldName)
  }
  isEnum(modelName: string, fieldName: string): boolean {
    return isFieldType._isEnum(this.schemaJSON, modelName, fieldName)
  }
  isURL(modelName: string, fieldName: string): boolean {
    return isFieldType._isURL(this.schemaJSON, modelName, fieldName)
  }
  isEmail(modelName: string, fieldName: string): boolean {
    return isFieldType._isEmail(this.schemaJSON, modelName, fieldName)
  }
  isPhone(modelName: string, fieldName: string): boolean {
    return isFieldType._isPhone(this.schemaJSON, modelName, fieldName)
  }
  isCurrency(modelName: string, fieldName: string): boolean {
    return isFieldType._isCurrency(this.schemaJSON, modelName, fieldName)
  }
  isDate(modelName: string, fieldName: string): boolean {
    return isFieldType._isDate(this.schemaJSON, modelName, fieldName)
  }
  isTextArea(modelName: string, fieldName: string): boolean {
    return isFieldType._isTextArea(this.schemaJSON, modelName, fieldName)
  }
  isFile(modelName: string, fieldName: string): boolean {
    return isFieldType._isFile(this.schemaJSON, modelName, fieldName)
  }
  isBoolean(modelName: string, fieldName: string): boolean {
    return isFieldType._isBoolean(this.schemaJSON, modelName, fieldName)
  }
  isPassword(modelName: string, fieldName: string): boolean {
    return isFieldType._isPassword(this.schemaJSON, modelName, fieldName)
  }

  // component overrides on field level

  getCellOverride(
    modelName: string,
    fieldName: string
  ): (() => JSX.Element) | undefined {
    return _getFieldOverride(this.schemaJSON, modelName, fieldName, 'cell')
  }
  getDetailFieldOverride(
    modelName: string,
    fieldName: string
  ): (() => JSX.Element) | undefined {
    return _getFieldOverride(this.schemaJSON, modelName, fieldName, 'detail')
  }
  getDetailLabelOverride(
    modelName: string,
    fieldName: string
  ): (() => JSX.Element) | undefined {
    return _getFieldOverride(
      this.schemaJSON,
      modelName,
      fieldName,
      'detailLabel'
    )
  }
  getDetailValueOverride(
    modelName: string,
    fieldName: string
  ): (() => JSX.Element) | undefined {
    return _getFieldOverride(
      this.schemaJSON,
      modelName,
      fieldName,
      'detailValue'
    )
  }
  getInputOverride(
    modelName: string,
    fieldName: string
  ): (() => JSX.Element) | undefined {
    return _getFieldOverride(this.schemaJSON, modelName, fieldName, 'input')
  }

  // component overrides on model level

  getCreateOverride(modelName: string): (() => JSX.Element) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'create')
  }
  getCreateTitleOverride(modelName: string): (() => JSX.Element) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'createTitle')
  }
  getCreatePageOverride(modelName: string): (() => JSX.Element) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'createPage')
  }
  getDetailOverride(modelName: string): (() => JSX.Element) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'detail')
  }
  getDetailTitleOverride(modelName: string): (() => JSX.Element) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'detailTitle')
  }
  getDetailPageOverride(modelName: string): (() => JSX.Element) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'detailPage')
  }
  getIndexOverride(modelName: string): (() => JSX.Element) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'index')
  }
  getIndexTitleOverride(modelName: string): (() => JSX.Element) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'indexTitle')
  }
  getIndexPageOverride(modelName: string): (() => JSX.Element) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'indexPage')
  }
}

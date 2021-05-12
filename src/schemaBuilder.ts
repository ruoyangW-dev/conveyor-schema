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
  [key: string]: any
}

export type DataType = [NodeType]

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
    customProps?: any
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
    customProps?: any
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
    data?: DataType
    customProps?: any
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
    fieldName: string
    node?: NodeType
    data?: DataType
    customProps?: any
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
    data?: DataType
    customProps?: any
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
  getModelAttribute(modelName: string, attributeName: string): any {
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

  isTableEditable({
    modelName,
    data,
    parentNode,
    fieldOrder,
    customProps
  }: {
    modelName: string
    data: DataType
    parentNode?: NodeType
    fieldOrder?: string[]
    customProps?: any
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
    customProps?: any
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
    customProps?: any
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
  isTableDeletable({
    modelName,
    data,
    parentNode,
    customProps
  }: {
    modelName: string
    data: DataType
    parentNode?: NodeType
    customProps?: any
  }): boolean {
    return callbackGetters._isTableDeletable({
      schema: this,
      modelName,
      data,
      parentNode,
      customProps
    })
  }
  isDeletable({
    modelName,
    node,
    parentNode,
    customProps
  }: {
    modelName: string
    node?: NodeType
    parentNode?: NodeType
    customProps?: any
  }): boolean {
    return callbackGetters._isDeletable({
      schema: this,
      modelName,
      node,
      parentNode,
      customProps
    })
  }
  isCreatable({
    modelName,
    parentNode,
    data,
    customProps
  }: {
    modelName: string
    parentNode?: NodeType
    data?: DataType
    customProps?: any
  }): boolean {
    return callbackGetters._isCreatable({
      schema: this,
      modelName,
      parentNode,
      data,
      customProps
    })
  }
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
  shouldDisplayIndex({
    modelName,
    fieldName,
    node,
    customProps
  }: {
    modelName: string
    fieldName: string
    node?: NodeType
    customProps?: any
  }): boolean {
    return callbackGetters._shouldDisplayIndex({
      schema: this,
      modelName,
      fieldName,
      node,
      customProps
    })
  }
  shouldDisplayDetail({
    modelName,
    fieldName,
    node,
    customProps
  }: {
    modelName: string
    fieldName: string
    node?: NodeType
    customProps?: any
  }): boolean {
    return callbackGetters._shouldDisplayDetail({
      schema: this,
      modelName,
      fieldName,
      node,
      customProps
    })
  }
  shouldDisplayCreate({
    modelName,
    fieldName,
    node,
    customProps
  }: {
    modelName: string
    fieldName: string
    node?: NodeType
    customProps?: any
  }): boolean {
    return callbackGetters._shouldDisplayCreate({
      schema: this,
      modelName,
      fieldName,
      node,
      customProps
    })
  }
  isFieldDisabled({
    modelName,
    fieldName,
    formStack,
    customProps
  }: {
    modelName: string
    fieldName: string
    formStack?: any
    customProps?: any
  }): boolean {
    return callbackGetters._isFieldDisabled({
      schema: this,
      modelName,
      fieldName,
      formStack,
      customProps
    })
  }
  isSortable({
    modelName,
    fieldName,
    customProps
  }: {
    modelName: string
    fieldName: string
    customProps?: any
  }): boolean {
    return callbackGetters._isSortable({
      schema: this,
      modelName,
      fieldName,
      customProps
    })
  }
  isTableSortable({
    modelName,
    customProps
  }: {
    modelName: string
    customProps?: any
  }): boolean {
    return callbackGetters._isTableSortable({
      schema: this,
      modelName,
      customProps
    })
  }
  isFilterable({
    modelName,
    fieldName,
    data,
    customProps
  }: {
    modelName: string
    fieldName: string
    data?: DataType
    customProps?: any
  }): boolean {
    return callbackGetters._isFilterable({
      schema: this,
      modelName,
      fieldName,
      data,
      customProps
    })
  }
  isTableFilterable({
    modelName,
    data,
    customProps
  }: {
    modelName: string
    data?: DataType
    customProps?: any
  }): boolean {
    return callbackGetters._isTableFilterable({
      schema: this,
      modelName,
      data,
      customProps
    })
  }
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
    data?: DataType
    customProps?: any
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
  getDetailFields({
    modelName,
    node,
    customProps
  }: {
    modelName: string
    node?: NodeType
    customProps?: any
  }): string[] {
    return callbackGetters._getDetailFields({
      schema: this,
      modelName,
      node,
      customProps
    })
  }
  getIndexFields({
    modelName,
    data,
    customProps
  }: {
    modelName: string
    data?: DataType
    customProps?: any
  }): string[] {
    return callbackGetters._getIndexFields({
      schema: this,
      modelName,
      data,
      customProps
    })
  }
  getCreateFields({
    modelName,
    customProps
  }: {
    modelName: string
    customProps?: any
  }): string[] {
    return callbackGetters._getCreateFields({
      schema: this,
      modelName,
      customProps
    })
  }
  getTooltipFields({
    modelName,
    customProps
  }: {
    modelName: string
    customProps?: any
  }): string[] {
    return callbackGetters._getTooltipFields({
      schema: this,
      modelName,
      customProps
    })
  }
  getOptionsOverride({
    modelName,
    fieldName,
    options,
    value,
    customProps
  }: {
    modelName: string
    fieldName: string
    options: []
    value?: any
    customProps?: any
  }): boolean | any[] {
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
  ): (() => any) | undefined {
    return _getFieldOverride(this.schemaJSON, modelName, fieldName, 'cell')
  }
  getDetailFieldOverride(
    modelName: string,
    fieldName: string
  ): (() => any) | undefined {
    return _getFieldOverride(this.schemaJSON, modelName, fieldName, 'detail')
  }
  getDetailLabelOverride(
    modelName: string,
    fieldName: string
  ): (() => any) | undefined {
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
  ): (() => any) | undefined {
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
  ): (() => any) | undefined {
    return _getFieldOverride(this.schemaJSON, modelName, fieldName, 'input')
  }

  // component overrides on model level

  getCreateOverride(modelName: string): (() => any) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'create')
  }
  getCreateTitleOverride(modelName: string): (() => any) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'createTitle')
  }
  getCreatePageOverride(modelName: string): (() => any) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'createPage')
  }
  getDetailOverride(modelName: string): (() => any) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'detail')
  }
  getDetailTitleOverride(modelName: string): (() => any) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'detailTitle')
  }
  getDetailPageOverride(modelName: string): (() => any) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'detailPage')
  }
  getIndexOverride(modelName: string): (() => any) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'index')
  }
  getIndexTitleOverride(modelName: string): (() => any) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'indexTitle')
  }
  getIndexPageOverride(modelName: string): (() => any) | undefined {
    return _getModelOverride(this.schemaJSON, modelName, 'indexPage')
  }
}

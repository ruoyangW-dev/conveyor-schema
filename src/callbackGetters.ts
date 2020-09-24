import * as R from 'ramda'
import { inputTypes } from './inputTypes'
import { SchemaBuilderType, DataType, NodeType } from './schemaBuilder'

// getter func with callbacks

/** IMPORTANT:
 * For isTableEditable, isRowEditable, isFieldEditable, is TableDeletable, isDeletable, & isCreatable
 * modelName must match any 'node' (or data[n]) __typename
 * parent 'node' must be labeled 'parentNode'
 */

export const _isTableEditable = ({ schema, modelName, data, parentNode, fieldOrder, customProps }:
      { schema: SchemaBuilderType, modelName: string, data: DataType, parentNode?: NodeType, fieldOrder?: [string], customProps?: any }) => {
  return !R.isEmpty(
    data.filter(node =>
      schema.isRowEditable({
        modelName,
        node,
        parentNode,
        fieldOrder,
        customProps
      })
    )
  )
}

//isRowEditable loops over all displayed fields to determine if the row is editable
export const _isRowEditable = ({ schema, modelName, node, parentNode, fieldOrder, customProps }:
      { schema: SchemaBuilderType, modelName: string, node: NodeType, parentNode?: NodeType, fieldOrder?: [string], customProps?: any }) => {
  if (!fieldOrder) {
    // @ts-ignore
    fieldOrder = Object.keys(R.omit(['__typename'], node))
  }
  for (const index in fieldOrder) {
    // @ts-ignore
    const fieldName = R.prop(index, fieldOrder)
    if (
      schema.isFieldEditable({
        modelName,
        fieldName,
        node,
        parentNode,
        customProps
      })
    ) {
      return true
    }
  }
  return false
}

export const _isFieldEditable = ({ schema, modelName, fieldName, node, parentNode, customProps }:
      { schema: SchemaBuilderType, modelName: string, fieldName: string, node?: NodeType, parentNode?: NodeType, customProps?: any }) => {
  const editable = R.propOr(!R.equals('id', fieldName), 'editable', schema.getField(modelName, fieldName))
  if (R.type(editable) === 'Boolean') {
    return editable
  } else if (R.type(editable) === 'Function') {
    // @ts-ignore
    return editable({ schema, modelName, fieldName, node, parentNode, customProps })
  } else {
    return false
  }
}

export const _isTableDeletable = ({ schema, modelName, data, parentNode, customProps }:
      { schema: SchemaBuilderType, modelName: string, data: DataType, parentNode?: NodeType, customProps?: any }) => {
  return !R.isEmpty(
    data.filter(node =>
      schema.isDeletable({
        modelName,
        node,
        parentNode,
        customProps
      })
    )
  )
}

export const _isDeletable = ({ schema, modelName, node, parentNode, customProps }:
      { schema: SchemaBuilderType, modelName: string, node?: NodeType, parentNode?: NodeType, customProps?: any }) => {
  const deletable = R.propOr(true, 'deletable', schema.getModel(modelName))
  if (R.type(deletable) === 'Boolean') {
    return deletable
  } else if (R.type(deletable) === 'Function') {
    // @ts-ignore
    return deletable({ schema, modelName, node, parentNode, customProps })
  } else {
    return false
  }
}

export const _isCreatable = ({ schema, modelName, parentNode, data, customProps }:
      { schema: SchemaBuilderType, modelName: string, parentNode?: NodeType, data?: DataType, customProps?: any }) => {
  const creatable = R.propOr(true, 'creatable', schema.getModel(modelName))
  if (R.type(creatable) === 'Boolean') {
    return creatable
  } else if (R.type(creatable) === 'Function') {
    // @ts-ignore
    return creatable({ schema, modelName, parentNode, data, customProps })
  } else {
    return false
  }
}

export const _shouldDisplayIndex = ({ schema, modelName, fieldName, node, customProps }:
      { schema: SchemaBuilderType, modelName: string, fieldName: string, node?: NodeType, customProps?: any }) => {
  const displayCondition = R.prop('index', schema.getFieldConditions(modelName, fieldName))
  return schema.shouldDisplay({ modelName, fieldName, node, displayCondition, customProps })
}
export const _shouldDisplayDetail = ({ schema, modelName, fieldName, node, customProps }:
      { schema: SchemaBuilderType, modelName: string, fieldName: string, node?: NodeType, customProps?: any }) => {
  const displayCondition = R.prop('detail', schema.getFieldConditions(modelName, fieldName))
  return schema.shouldDisplay({ modelName, fieldName, node, displayCondition, customProps })
}
export const _shouldDisplayCreate = ({ schema, modelName, fieldName, node, customProps }:
      { schema: SchemaBuilderType, modelName: string, fieldName: string, node?: NodeType, customProps?: any }) => {
  const displayCondition = R.prop('create', schema.getFieldConditions(modelName, fieldName))
  return schema.shouldDisplay({ modelName, fieldName, node, displayCondition, customProps })
}

export const _shouldDisplay = ({ schema, modelName, fieldName, node, displayCondition, customProps }:
      { schema: SchemaBuilderType, modelName: string, fieldName: string, node?: NodeType, displayCondition: any, customProps?: any }) => {
  if (R.type(displayCondition) === 'Boolean') {
    return displayCondition
  } else if (R.type(displayCondition) === 'Function') {
    return displayCondition({ schema, modelName, fieldName, node, customProps })
  } else {
    return true
  }
}

export const _isFieldDisabled = ({ schema, modelName, fieldName, formStack, customProps }:
      { schema: SchemaBuilderType, modelName: string, fieldName: string, formStack?: any, customProps?: any }) => {
  const stackIndex = R.prop('index', formStack)
  const stack = R.prop('stack', formStack)
  const form = R.prop(stackIndex, stack)

  const type = schema.getType(modelName, fieldName)

  // check the form to see if 'disabled' flag set true
  let defaultDisable = false
  if (type.includes('ToMany')) {
    // @ts-ignore
    defaultDisable = R.path(['fields', fieldName, 0, 'disabled'], form)
  } else if (type.includes('ToOne')) {
    // @ts-ignore
    defaultDisable = R.path(['fields', fieldName, 'disabled'], form)
  }

  // boolean, function, or null
  const disableCondition = schema.getFieldDisableCondition(modelName, fieldName)

  if (R.type(disableCondition) === 'Function') {
    return disableCondition({ schema, modelName, fieldName, defaultDisable, customProps })
  }
  if (R.type(disableCondition) === 'Boolean') {
    return disableCondition
  }

  return defaultDisable
}

// note: should not be used w/o checking 'isTableSortable' as well (model lvl req)
export const _isSortable = ({ schema, modelName, fieldName, customProps }:
      { schema: SchemaBuilderType, modelName: string, fieldName: string, customProps?: any }) => {
  // first check if can sort on field level
  const fieldSortable = R.propOr(true, 'sortable', schema.getField(modelName, fieldName))
  if (fieldSortable === false) {
    return false
  }
  // repeat above if 'fieldSortable' is function
  // @ts-ignore
  if (R.type(fieldSortable) === 'Function' && fieldSortable({ schema, modelName, fieldName, customProps }) === false) {
    return false
  }
  // by default, all non-rel fields are sortable
  return !schema.isRel(modelName, fieldName)
}

export const _isTableSortable = ({ schema, modelName, customProps }:
      { schema: SchemaBuilderType, modelName: string, customProps?: any }) => {
  // first check if can sort on model level
  const tableSortable = R.propOr(true, 'sortable', schema.getModel(modelName))
  if (tableSortable === false) {
    return false
  }
  // repeat above if 'tableSortable' is function
  // @ts-ignore
  if (R.type(tableSortable) === 'Function' && tableSortable({ schema, modelName, customProps }) === false) {
    return false
  }
  // next, check field level sort
  const model = schema.getModel(modelName)
  // @ts-ignore
  const fieldOrder = R.prop('fieldOrder', model)
  const boolList = R.map(fieldName => schema.isSortable({ modelName, fieldName, customProps }), fieldOrder)
  return !R.isEmpty(R.filter(R.identity, boolList))
}

// should not be used w/o checking 'isTableFilterable' as well (model level req)
export const _isFilterable = ({ schema, modelName, fieldName, data, customProps }:
      { schema: SchemaBuilderType, modelName: string, fieldName: string, data?: DataType, customProps?: any }) => {
  // first check if can filter on field level
  const fieldFilterable = R.propOr(true, 'filterable', schema.getField(modelName, fieldName))
  if (fieldFilterable === false) {
    return false
  }
  // repeat above if 'fieldFilterable' is function
  if (
    R.type(fieldFilterable) === 'Function' &&
      // @ts-ignore
    fieldFilterable({ schema, modelName, fieldName, data, customProps }) === false
  ) {
    return false
  }
  // next, filter out field types which don't work with magql
  const inputType = schema.getType(modelName, fieldName)
  return !(
    R.isNil(inputType) ||
    (inputType === inputTypes.CREATABLE_STRING_SELECT_TYPE) ||
    (inputType === inputTypes.ONE_TO_MANY_TYPE) ||
    (inputType === inputTypes.MANY_TO_MANY_TYPE) ||
    (inputType === inputTypes.PHONE_TYPE) ||
    (inputType === inputTypes.ID_TYPE)
  )
}

export const _isTableFilterable = ({ schema, modelName, data, customProps }:
      { schema: SchemaBuilderType, modelName: string, data?: DataType, customProps?: any }) => {
  // first check if can filter on model level
  const tableFilterable = R.propOr(true, 'filterable', schema.getModel(modelName))
  if (tableFilterable === false) {
    return false
  }
  // repeat above if 'tableFilterable' is function
  if (
    R.type(tableFilterable) === 'Function' &&
      // @ts-ignore
    tableFilterable({ schema, modelName, data, customProps }) === false
  ) {
    return false
  }
  // next, check field level filter
  const model = schema.getModel(modelName)
  // @ts-ignore
  const fieldOrder = R.prop('fieldOrder', model)
  const boolList = R.map(fieldName =>
    schema.isFilterable({ modelName, fieldName, data, customProps }),
    fieldOrder
  )
  return !R.isEmpty(R.filter(R.identity, boolList))
}

export const _getShownFields = ({ schema, modelName, type, node, data, customProps }:
      { schema: SchemaBuilderType, modelName: string, type: string, node?: NodeType, data?: DataType, customProps?: any }) => {
  // @ts-ignore
  const fieldOrder = R.prop('fieldOrder', schema.getModel(modelName))
  return R.filter(fieldName => {
    let show
    switch (type) {
      case 'showCreate':
      case 'showDetail':
        show = R.propOr(
          !R.equals('id', fieldName),
          type,
          // @ts-ignore
          schema.getField(modelName, fieldName)
        )
        break
      case 'showIndex':
      case 'showTooltip':
        // @ts-ignore
        show = R.propOr(false, type, schema.getField(modelName, fieldName))
        break
      default:
        // @ts-ignore
        show = R.prop(type, schema.getField(modelName, fieldName))
    }
    if (R.type(show) === 'Function') {
      show = show({
        schema, modelName, fieldName, node, data, customProps
      })
    }
    return show
  }, fieldOrder)
}

export const _getDetailFields = ({ schema, modelName, node, customProps }:
      { schema: SchemaBuilderType, modelName: string, node?: NodeType, customProps?: any }) => {
  // @ts-ignore
  const detailFieldOrder = R.prop('detailFieldOrder', schema.getModel(modelName))
  const defaultOrder = schema.getShownFields({ modelName, type: 'showDetail', node, customProps })
  if (R.type(detailFieldOrder) === 'Function') {
    return detailFieldOrder({ schema, modelName, node, defaultOrder, customProps })
  } else if (R.type(detailFieldOrder) === 'Array') {
    return detailFieldOrder
  }
  return defaultOrder
}

export const _getIndexFields = ({ schema, modelName, data, customProps }:
      { schema: SchemaBuilderType, modelName: string, data?: DataType, customProps?: any }) => {
  // @ts-ignore
  const indexFieldOrder = R.prop('indexFieldOrder', schema.getModel(modelName))
  const defaultOrder = schema.getShownFields({ modelName, type: 'showIndex', data, customProps })
  if (R.type(indexFieldOrder) === 'Function') {
    return indexFieldOrder({ schema, modelName, data, defaultOrder, customProps })
  } else if (R.type(indexFieldOrder) === 'Array') {
    return indexFieldOrder
  }
  return defaultOrder
}

export const _getCreateFields = ({ schema, modelName, customProps }:
      { schema: SchemaBuilderType, modelName: string, customProps?: any }) => {
  // @ts-ignore
  const createFieldOrder = R.prop('createFieldOrder', schema.getModel(modelName))
  const defaultOrder = schema.getShownFields({ modelName, type: 'showCreate', customProps })
  if (R.type(createFieldOrder) === 'Function') {
    return createFieldOrder({ schema, modelName, defaultOrder, customProps })
  } else if (R.type(createFieldOrder) === 'Array') {
    return createFieldOrder
  }
  return defaultOrder
}

export const _getTooltipFields = ({ schema, modelName, customProps }:
      { schema: SchemaBuilderType, modelName: string, customProps?: any }) => {
  // @ts-ignore
  const tooltipFieldOrder = R.prop('tooltipFieldOrder', schema.getModel(modelName))
  const defaultOrder = schema.getShownFields({ modelName, type: 'showTooltip', customProps })
  if (R.type(tooltipFieldOrder) === 'Function') {
    return tooltipFieldOrder({ schema, modelName, defaultOrder, customProps })
  } else if (R.type(tooltipFieldOrder) === 'Array') {
    return tooltipFieldOrder
  }
  return defaultOrder
}

export const _getOptionsOverride = ({ schema, modelName, fieldName, options, value, customProps }:
      { schema: SchemaBuilderType, modelName: string, fieldName: string, options: [], value?: any, customProps?: any }) => {
  const disabledDropDownCond = schema.getDropDownDisableCondition(modelName, fieldName)
  if (disabledDropDownCond) {
    // @ts-ignore
    options = disabledDropDownCond({
      schema, modelName, fieldName, options, value, customProps
    })
  }
  return options
}

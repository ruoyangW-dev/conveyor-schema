import * as R from 'ramda'
import { inputTypes } from './inputTypes'
import type { DataType, NodeType } from './schemaBuilder'
import type { CallbackProps, DisplayCondition } from './schemaJson'
import type { FormStack } from './formstack'

// getter func with callbacks

// export interface GetterProps {
//   schema: SchemaBuilder
//   modelName: string
//   parentNode?: NodeType
//   fieldOrder?: string[]
//   customProps?: Record<string, any>
// }

/** IMPORTANT:
 * For isTableEditable, isRowEditable, isFieldEditable, is TableDeletable, isDeletable, & isCreatable
 * modelName must match any 'node' (or data[n]) __typename
 * parent 'node' must be labeled 'parentNode'
 */

export const _isTableEditable = ({
  schema,
  modelName,
  data,
  parentNode,
  fieldOrder,
  customProps
}: Omit<CallbackProps, 'fieldName'> & {
  data: DataType
  parentNode?: NodeType
  fieldOrder?: string[]
}): boolean => {
  return !R.isEmpty(
    data.filter((node) =>
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
export const _isRowEditable = ({
  schema,
  modelName,
  node,
  parentNode,
  fieldOrder = Object.keys(node || {}).filter((key) => key !== '__typename'),
  customProps
}: Omit<CallbackProps, 'fieldName'> & {
  node?: NodeType
  parentNode?: NodeType
  fieldOrder?: string[]
}): boolean => {
  for (const index in fieldOrder) {
    const fieldName = fieldOrder[index]
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

export const _isFieldEditable = ({
  schema,
  modelName,
  fieldName,
  node,
  parentNode,
  customProps
}: CallbackProps & { node?: NodeType; parentNode?: NodeType }): boolean => {
  // const editable: Field['editable'] = R.propOr(
  //   !R.equals('id', fieldName),
  //   'editable',
  //   schema.getField(modelName, fieldName)
  // )
  const { editable = 'id' === fieldName } =
    schema.getField(modelName, fieldName) || {}

  if (typeof editable === 'boolean') {
    return editable
  } else if (typeof editable === 'function') {
    return editable({
      schema,
      modelName,
      fieldName,
      node,
      parentNode,
      customProps
    })
  } else {
    return false
  }
}

export const _isTableDeletable = ({
  schema,
  modelName,
  data,
  parentNode,
  customProps
}: Omit<CallbackProps, 'fieldName'> & {
  data: DataType
  parentNode?: NodeType
}): boolean => {
  return !R.isEmpty(
    data.filter((node) =>
      schema.isDeletable({
        modelName,
        node,
        parentNode,
        customProps
      })
    )
  )
}

export const _isDeletable = ({
  schema,
  modelName,
  node,
  parentNode,
  customProps
}: Omit<CallbackProps, 'fieldName'> & {
  node?: NodeType
  parentNode?: NodeType
}): boolean => {
  const { deletable } = schema.getModel(modelName)

  if (typeof deletable === 'boolean') {
    return deletable
  } else if (typeof deletable === 'function') {
    return deletable({ schema, modelName, node, parentNode, customProps })
  } else {
    return false
  }
}

export const _isCreatable = ({
  schema,
  modelName,
  parentNode,
  data,
  customProps
}: Omit<CallbackProps, 'fieldName'> & {
  parentNode?: NodeType
  data?: DataType
}): boolean => {
  const { creatable } = schema.getModel(modelName)

  if (typeof creatable === 'boolean') {
    return creatable
  } else if (typeof creatable === 'function') {
    return creatable({ schema, modelName, parentNode, data, customProps })
  } else {
    return false
  }
}

export const _shouldDisplayIndex = ({
  schema,
  modelName,
  fieldName,
  node,
  customProps
}: CallbackProps & { node?: NodeType }): boolean => {
  // const displayCondition = R.prop(
  //   'index',
  //   schema.getFieldConditions(modelName, fieldName)
  // )

  const displayCondition = schema.getFieldConditions(
    modelName,
    fieldName
  )?.index
  return schema.shouldDisplay({
    modelName,
    fieldName,
    node,
    displayCondition,
    customProps
  })
}
export const _shouldDisplayDetail = ({
  schema,
  modelName,
  fieldName,
  node,
  customProps
}: CallbackProps & { node?: NodeType }): boolean => {
  const displayCondition = schema.getFieldConditions(
    modelName,
    fieldName
  )?.detail
  return schema.shouldDisplay({
    modelName,
    fieldName,
    node,
    displayCondition,
    customProps
  })
}
export const _shouldDisplayCreate = ({
  schema,
  modelName,
  fieldName,
  node,
  customProps
}: CallbackProps & { node?: NodeType }): boolean => {
  const displayCondition = schema.getFieldConditions(
    modelName,
    fieldName
  )?.create
  return schema.shouldDisplay({
    modelName,
    fieldName,
    node,
    displayCondition,
    customProps
  })
}

export const _shouldDisplay = ({
  schema,
  modelName,
  fieldName,
  node,
  displayCondition,
  customProps
}: CallbackProps & {
  displayCondition?: DisplayCondition
  node?: NodeType
}): boolean => {
  if (typeof displayCondition === 'boolean') {
    return displayCondition
  } else if (typeof displayCondition === 'function') {
    return displayCondition({ schema, modelName, fieldName, node, customProps })
  } else {
    return true
  }
}

export const _isFieldDisabled = ({
  schema,
  modelName,
  fieldName,
  formStack,
  customProps
}: CallbackProps & { formStack: FormStack }): boolean => {
  const { index: stackIndex, stack } = formStack
  const { form } = stack[stackIndex]

  const type = schema.getType(modelName, fieldName) as string // this can't be right?

  // check the form to see if 'disabled' flag set true
  let defaultDisable = false
  if (type.includes('ToMany')) {
    defaultDisable = R.path(['fields', fieldName, 0, 'disabled'], form) || false
  } else if (type.includes('ToOne')) {
    defaultDisable = R.path(['fields', fieldName, 'disabled'], form) || false
  }

  // boolean, function, or null
  const disableCondition = schema.getFieldDisableCondition(modelName, fieldName)

  if (typeof disableCondition === 'function') {
    return (
      disableCondition({
        schema,
        modelName,
        fieldName,
        defaultDisable,
        customProps
      }) || false
    )
  }
  if (R.type(disableCondition) === 'Boolean') {
    return disableCondition || false
  }

  return defaultDisable
}

// note: should not be used w/o checking 'isTableSortable' as well (model lvl req)
export const _isSortable = ({
  schema,
  modelName,
  fieldName,
  customProps
}: CallbackProps): boolean => {
  // first check if can sort on field level
  const fieldSortable = schema.getField(modelName, fieldName)?.sortable ?? false
  if (fieldSortable === false) {
    return false
  }
  // repeat above if 'fieldSortable' is function
  if (
    (typeof fieldSortable === 'function' &&
      //R.type(fieldSortable) === 'Function' &&
      fieldSortable({
        schema,
        modelName,
        fieldName,
        customProps
      })) === false
  ) {
    return false
  }
  // by default, all non-rel fields are sortable
  return !schema.isRel(modelName, fieldName)
}

export const _isTableSortable = ({
  schema,
  modelName,
  customProps
}: Omit<CallbackProps, 'fieldName'>): boolean => {
  // first check if can sort on model level
  //const tableSortable = R.propOr(true, 'sortable', schema.getModel(modelName))
  const tableSortable = schema.getModel(modelName).sortable
  if (tableSortable === false) {
    return false
  }
  // repeat above if 'tableSortable' is function

  if (
    typeof tableSortable === 'function' &&
    //R.type(tableSortable) === 'Function' &&
    !tableSortable({ schema, modelName, customProps })
  ) {
    return false
  }
  // next, check field level sort
  const model = schema.getModel(modelName)

  const { fieldOrder = [] } = model

  const boolList = R.map(
    (fieldName) => schema.isSortable({ modelName, fieldName, customProps }),
    fieldOrder
  )

  return !R.isEmpty(R.filter(R.identity, boolList))
}

// should not be used w/o checking 'isTableFilterable' as well (model level req)
export const _isFilterable = ({
  schema,
  modelName,
  fieldName,
  data,
  customProps
}: CallbackProps & { data?: DataType }): boolean => {
  // first check if can filter on field level
  // const fieldFilterable = R.propOr(
  //   true,
  //   'filterable',
  //   schema.getField(modelName, fieldName)
  // )
  const fieldFilterable =
    schema.getField(modelName, fieldName)?.filterable ?? true

  if (fieldFilterable === false) {
    return false
  }
  // repeat above if 'fieldFilterable' is function
  if (
    typeof fieldFilterable === 'function' &&
    fieldFilterable({ schema, modelName, fieldName, data, customProps }) ===
      false
  ) {
    return false
  }
  // next, filter out field types which don't work with magql
  const inputType = schema.getType(modelName, fieldName)
  return !(
    R.isNil(inputType) ||
    inputType === inputTypes.CREATABLE_STRING_SELECT_TYPE ||
    inputType === inputTypes.ONE_TO_MANY_TYPE ||
    inputType === inputTypes.MANY_TO_MANY_TYPE ||
    inputType === inputTypes.PHONE_TYPE ||
    inputType === inputTypes.ID_TYPE
  )
}

export const _isTableFilterable = ({
  schema,
  modelName,
  data,
  customProps
}: Omit<CallbackProps, 'fieldName'> & { data?: DataType }): boolean => {
  // first check if can filter on model level
  // const tableFilterable = R.propOr(
  //   true,
  //   'filterable',
  //   schema.getModel(modelName)
  // )
  const tableFilterable = schema.getModel(modelName)?.filterable ?? true
  if (tableFilterable === false) {
    return false
  }
  // repeat above if 'tableFilterable' is function
  if (
    typeof tableFilterable === 'function' &&
    !tableFilterable({ schema, modelName, data, customProps })
  ) {
    return false
  }
  // next, check field level filter
  const model = schema.getModel(modelName)

  const { fieldOrder = [] } = model

  const boolList = R.map(
    (fieldName) =>
      schema.isFilterable({ modelName, fieldName, data, customProps }),
    fieldOrder
  )

  return !R.isEmpty(R.filter(R.identity, boolList))
}

export const _getShownFields = ({
  schema,
  modelName,
  type,
  node,
  data,
  customProps
}: Omit<CallbackProps, 'fieldName'> & {
  type: string
  data?: DataType
  node?: NodeType
}): string[] => {
  //const fieldOrder = R.prop('fieldOrder', schema.getModel(modelName))
  const fieldOrder = schema.getModel(modelName).fieldOrder || []

  return R.filter((fieldName): any => {
    let show: any
    switch (type) {
      case 'showCreate':
      case 'showDetail':
        show = R.propOr(
          !R.equals('id', fieldName),
          type,
          schema.getField(modelName, fieldName)
        )
        break
      case 'showIndex':
      case 'showTooltip':
        show = R.propOr(false, type, schema.getField(modelName, fieldName))
        break
      default:
        //show = R.prop(type, schema.getField(modelName, fieldName))
        show = schema.getField(modelName, fieldName)?.[type] ?? false
    }
    if (typeof show === 'function') {
      show = show({
        schema,
        modelName,
        fieldName,
        node,
        data,
        customProps
      })
    }
    return show
  }, fieldOrder)
}

export const _getDetailFields = ({
  schema,
  modelName,
  node,
  customProps
}: Omit<CallbackProps, 'fieldName'> & { node?: NodeType }): string[] => {
  // const detailFieldOrder = R.prop(
  //   'detailFieldOrder',
  //   schema.getModel(modelName)
  // )
  const { detailFieldOrder } = schema.getModel(modelName)

  const defaultOrder = schema.getShownFields({
    modelName,
    type: 'showDetail',
    node,
    customProps
  })
  if (typeof detailFieldOrder === 'function') {
    return detailFieldOrder({
      schema,
      modelName,
      node,
      defaultOrder,
      customProps
    })
  } else if (Array.isArray(detailFieldOrder)) {
    return detailFieldOrder
  }
  return defaultOrder
}

export const _getIndexFields = ({
  schema,
  modelName,
  data,
  customProps
}: Omit<CallbackProps, 'fieldName'> & { data?: DataType }): string[] => {
  const { indexFieldOrder } = schema.getModel(modelName)
  const defaultOrder = schema.getShownFields({
    modelName,
    type: 'showIndex',
    data,
    customProps
  })
  if (typeof indexFieldOrder === 'function') {
    return indexFieldOrder({
      schema,
      modelName,
      data,
      defaultOrder,
      customProps
    })
  } else if (Array.isArray(indexFieldOrder)) {
    return indexFieldOrder
  }
  return defaultOrder
}

export const _getCreateFields = ({
  schema,
  modelName,
  customProps
}: Omit<CallbackProps, 'fieldName'>): string[] => {
  const { createFieldOrder } = schema.getModel(modelName)

  const defaultOrder = schema.getShownFields({
    modelName,
    type: 'showCreate',
    customProps
  })
  if (typeof createFieldOrder === 'function') {
    return createFieldOrder({ schema, modelName, defaultOrder, customProps })
  } else if (Array.isArray(createFieldOrder)) {
    return createFieldOrder
  }
  return defaultOrder
}

export const _getTooltipFields = ({
  schema,
  modelName,
  customProps
}: Omit<CallbackProps, 'fieldName'>): string[] => {
  const { tooltipFieldOrder } = schema.getModel(modelName)
  const defaultOrder = schema.getShownFields({
    modelName,
    type: 'showTooltip',
    customProps
  })
  if (typeof tooltipFieldOrder === 'function') {
    return tooltipFieldOrder({ schema, modelName, defaultOrder, customProps })
  } else if (Array.isArray(tooltipFieldOrder)) {
    return tooltipFieldOrder
  }
  return defaultOrder
}

export const _getOptionsOverride = ({
  schema,
  modelName,
  fieldName,
  options,
  value,
  customProps
}: CallbackProps & { options: any[]; value?: any }): boolean | any[] => {
  const disabledDropDownCond = schema.getDropDownDisableCondition(
    modelName,
    fieldName
  )
  if (disabledDropDownCond) {
    return disabledDropDownCond({
      schema,
      modelName,
      fieldName,
      options,
      value,
      customProps
    })
  }
  return options
}

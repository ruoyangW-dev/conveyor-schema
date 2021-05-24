import {
  humanizeField,
  humanizeModel,
  humanizeModelPlural
} from './stringHelper'
import { SchemaBuilderType, NodeType } from './schemaBuilder'
import { BasicFieldType, CallbackProps, RelFieldType } from './schemaJson'

// common name/title getters

/* String representing a single instance of a row in a table.
For example, in a table 'Book', getDisplayValue() returns 'Robinson Crusoe' */

export const _getDisplayValue = ({
  schema,
  modelName,
  node,
  customProps
}: Omit<CallbackProps, 'fieldName'> & { node?: NodeType }): string => {
  const model = schema.getModel(modelName)
  // the displayField indicates which field 'represents' the entire model (usually 'name')
  //const displayField = R.propOr('name', 'displayField', model)
  const { displayField = 'name' } = model

  if (typeof displayField === 'function') {
    return displayField({ schema, modelName, node, customProps })
  }

  const displayValue = node?.[displayField]

  return typeof displayValue === 'string' ? displayValue : ''
}

export const _getFieldLabel = ({
  schema,
  modelName,
  fieldName,
  node,
  data,
  customProps
}: CallbackProps & { node?: NodeType; data?: NodeType[] }): string => {
  const defaultValue = humanizeField(fieldName)
  // const displayName = R.pathOr(
  //   defaultValue,
  //   [modelName, 'fields', fieldName, 'displayName'],
  //   schema.schemaJSON
  // )
  const displayName =
    schema.schemaJSON[modelName]?.fields[fieldName]?.displayName ?? defaultValue

  if (typeof displayName === 'function') {
    return displayName({
      schema,
      modelName,
      fieldName,
      node,
      data,
      defaultValue,
      customProps
    })
  }
  return displayName
}
export const _getNoDataDisplayValue = ({
  schema,
  modelName,
  fieldName,
  node,
  customProps
}: {
  schema: SchemaBuilderType
  modelName: string
  fieldName: string
  node?: NodeType
  customProps?: Record<string, unknown>
}): string => {
  const model = schema.getModel(modelName)
  const noDataDisplayValue = model.fields[fieldName].noDataDisplayValue || 'N/A'

  if (typeof noDataDisplayValue === 'function') {
    return noDataDisplayValue({
      schema,
      modelName,
      fieldName,
      node,
      customProps
    })
  }
  return noDataDisplayValue
}

export const _getModelLabel = ({
  schema,
  modelName,
  node,
  data,
  customProps
}: Omit<CallbackProps, 'fieldName'> & {
  node?: NodeType
  data?: NodeType[]
}): string => {
  const defaultValue = humanizeModel(modelName)
  const displayName = schema.schemaJSON[modelName].displayName ?? defaultValue

  if (typeof displayName === 'function') {
    return displayName({
      schema,
      modelName,
      node,
      data,
      defaultValue,
      customProps
    })
  }
  return displayName
}

export const _getModelLabelPlural = ({
  schema,
  modelName,
  data,
  customProps
}: Omit<CallbackProps, 'fieldName'> & { data?: NodeType[] }): string => {
  const defaultValue = humanizeModelPlural(modelName)
  // const displayName = R.pathOr(
  //   defaultValue,
  //   [modelName, 'displayNamePlural'],
  //   schema.schemaJSON
  // )
  const displayName =
    schema.schemaJSON[modelName].displayNamePlural ?? defaultValue

  if (typeof displayName === 'function') {
    return displayName({ schema, modelName, data, defaultValue, customProps })
  }
  return displayName
}

// common getters

export const _getType = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string
): BasicFieldType | RelFieldType | undefined => {
  const field = schema.getField(modelName, fieldName)
  if (!field) return
  if (typeof field.type === 'object') {
    return field.type.type
  }

  return field.type //R.prop('type', field)
}

export const _getEnumLabel = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string,
  value?: string
): string | undefined => {
  const field = schema.getField(modelName, fieldName)
  if (!field || !value) return
  return field.choices?.[value]
}

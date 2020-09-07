import * as R from 'ramda'
import { humanizeField, humanizeModel, humanizeModelPlural } from './stringHelper'
import { SchemaBuilderType, NodeType, DataType } from './schemaBuilder'

// common name/title getters

/* String representing a single instance of a row in a table.
For example, in a table 'Book', getDisplayValue() returns 'Robinson Crusoe' */

export const _getDisplayValue = ({ schema, modelName, node, customProps }:
                                     { schema: SchemaBuilderType, modelName: string, node?: NodeType, customProps?: any }) => {
  const model = schema.getModel(modelName)
  // the displayField indicates which field 'represents' the entire model (usually 'name')
  const displayField = R.propOr('name', 'displayField', model)
  if (R.type(displayField) === 'Function') {
    // @ts-ignore
    return displayField({ schema, modelName, node, customProps })
  }
  // @ts-ignore
  return R.prop(displayField, node)
}

export const _getFieldLabel = ({ schema, modelName, fieldName, node, data, customProps }:
                                   { schema: SchemaBuilderType, modelName: string, fieldName: string, node?: NodeType, data?: DataType, customProps?: any }) => {
  const defaultValue = humanizeField(fieldName)
  const displayName = R.pathOr(defaultValue, [modelName, 'fields', fieldName, 'displayName'], schema.schemaJSON)
  if (R.type(displayName) === 'Function') {
    // @ts-ignore
    return displayName({ schema, modelName, node, data, defaultValue, customProps })
  }
  return displayName
}

export const _getModelLabel = ({ schema, modelName, node, data, customProps }:
                                   { schema: SchemaBuilderType, modelName: string, node?: NodeType, data?: DataType, customProps?: any }) => {
  const defaultValue = humanizeModel(modelName)
  const displayName = R.pathOr(defaultValue, [modelName, 'displayName'], schema.schemaJSON)
  if (R.type(displayName) === 'Function') {
    // @ts-ignore
    return displayName({ schema, modelName, node, data, defaultValue, customProps })
  }
  return displayName
}

export const _getModelLabelPlural = ({ schema, modelName, data, customProps }:
                                         { schema: SchemaBuilderType, modelName: string, data?: DataType, customProps?: any}) => {
  const defaultValue = humanizeModelPlural(modelName)
  const displayName = R.pathOr(defaultValue, [modelName, 'displayNamePlural'], schema.schemaJSON)
  if (R.type(displayName) === 'Function') {
    // @ts-ignore
    return displayName({ schema, modelName, data, defaultValue, customProps })
  }
  return displayName
}

// common getters

export const _getModel = (schema: SchemaBuilderType, modelName: string) => (
  R.path(['schemaJSON', modelName], schema)
)

export const _getModelAttribute = (schema: SchemaBuilderType, modelName: string, attributeName: string) => (
    // @ts-ignore
  R.prop(attributeName, schema.getModel(modelName))
)

export const _getActions = (schema: SchemaBuilderType, modelName: string) => {
  return schema.getModelAttribute(modelName, 'actions')
}

export const _getFields = (schema: SchemaBuilderType, modelName: string) => {
  return schema.getModelAttribute(modelName, 'fields')
}

export const _getField = (schema: SchemaBuilderType, modelName: string, fieldName: string) => (
  // @ts-ignore
  R.prop(fieldName, schema.getFields(modelName))
)

export const _getType = (schema: SchemaBuilderType, modelName: string, fieldName: string) => {
  const field = schema.getField(modelName, fieldName)
  if (schema.isRel(modelName, fieldName)) {
    return R.path(['type', 'type'], field)
  }
  // @ts-ignore
  return R.prop('type', field)
}

export const _getEnumLabel = (schema: SchemaBuilderType, modelName: string, fieldName: string, value?: any) => {
  const field = schema.getField(modelName, fieldName)
  return R.path(['choices', value], field)
}

import * as R from 'ramda'
import { humanizeField, humanizeModel, humanizeModelPlural } from './stringHelper'
import { SchemaBuilderType, NodeType, DataType } from './schemaBuilder'

// common name/title getters

/* String representing a single instance of a row in a table.
For example, in a table 'Book', getDisplayValue() returns 'Robinson Crusoe' */

export const _getDisplayValue = ({ schema, modelName, node, customProps }:
                                     { schema: SchemaBuilderType, modelName: string, node?: NodeType, customProps?: any }) => {
  /* schema's 'displayField' can be:

  1.) a string (used by magql)
  2.) a callback function (used by conveyor-schema)

  There are two methods of calculating the value displayed:

  1.) calculated on the backend
  (magql, by default, looks at the models 'displayField' string and retrieves the field it corresponds to)
  This gives you a 'displayName' string in the 'node' attribute:

    // on backend pseudo code setting 'Book' displayName:
    bookNode['displayName'] = bookInstance[schema.Book.displayField]

    // frontend queried value:
    const display = node.displayName

  This gets returned by the query as 'displayName' in the 'node' attribute. Alternatively,
  the backend may override magql's functionality on the backend and come up with its own 'displayName' which
  will be inserted into the node's 'displayName'.

  2.) calculated on the frontend
  (done by conveyor-schema)
  If 'displayField' is a callback function, then this overrides whatever is returned by the backend.
  If 'displayField' is not a function, it returns whatever 'displayName' is by default. */

  const model = schema.getModel(modelName)
  // the displayField indicates which field 'represents' the entire model (usually 'name')
  const displayField = R.propOr('name', 'displayField', model)
  if (R.type(displayField) === 'Function') {
    // @ts-ignore
    return displayField({ schema, modelName, node, customProps })
  }
  // @ts-ignore
  return R.prop('displayValue', node)
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
  R.prop(fieldName, schema.getFields(modelName))
)

export const _getType = (schema: SchemaBuilderType, modelName: string, fieldName: string) => {
  const field = schema.getField(modelName, fieldName)
  if (schema.isRel(modelName, fieldName)) {
    return R.path(['type', 'type'], field)
  }
  return R.prop('type', field)
}

export const _getEnumLabel = (schema: SchemaBuilderType, modelName: string, fieldName: string, value?: any) => {
  const field = schema.getField(modelName, fieldName)
  return R.path(['choices', value], field)
}
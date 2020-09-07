import * as R from 'ramda'
import { SchemaBuilderType } from './schemaBuilder'

export const _getFieldConditions = (schema: SchemaBuilderType, modelName: string, fieldName: string) => {
  // @ts-ignore
  return R.prop('displayConditions', schema.getField(modelName, fieldName))
}

export const _getFieldDisableCondition = (schema: SchemaBuilderType, modelName: string, fieldName: string) => {
  // @ts-ignore
  return R.prop('disabled', schema.getField(modelName, fieldName))
}

export const _getDropDownDisableCondition = (schema: SchemaBuilderType, modelName: string, fieldName: string) => {
  return R.propOr(null, 'disabledDropDown', schema.getField(modelName, fieldName))
}

export const _getFieldHelpText = (schema: SchemaBuilderType, modelName: string, fieldName: string) => {
  return R.propOr(null, 'fieldHelp', schema.getField(modelName, fieldName))
}

export const _getRequiredFields = (schema: SchemaBuilderType, modelName: string) => {
  return schema.getShownFields({ modelName, type: 'required' })
}

export const _getHasIndex = (schema: SchemaBuilderType, modelName: string) => {
  return R.propOr(true, 'hasIndex', schema.getModel(modelName))
}

export const _getHasDetail = (schema: SchemaBuilderType, modelName: string) => {
  return R.propOr(true, 'hasDetail', schema.getModel(modelName))
}

export const _getSingleton = (schema: SchemaBuilderType, modelName: string) => {
  return R.propOr(false, 'singleton', schema.getModel(modelName))
}

export const _getEnumChoices = (schema: SchemaBuilderType, modelName: string, fieldName: string) => {
  // @ts-ignore
  return R.prop('choices', schema.getField(modelName, fieldName))
}

export const _getEnumChoiceOrder = (schema: SchemaBuilderType, modelName: string, fieldName: string) => {
  // @ts-ignore
  return R.prop('choiceOrder', schema.getField(modelName, fieldName))
}

export const _getCollapsable = (schema: SchemaBuilderType, modelName: string, fieldName: string) => {
  return R.propOr(true, 'collapsable', schema.getField(modelName, fieldName))
}

export const _getSearchable = (schema: SchemaBuilderType, modelName: string) => {
  return R.propOr(false, 'searchable', schema.getModel(modelName))
}

export const _getTableLinkField = (schema: SchemaBuilderType, modelName: string, fieldOrder: []) => {
  const model = schema.getModel(modelName)
  // @ts-ignore
  const schemaDefinedLinkField = R.prop('tableLinkField', model)

  // If the schema does not define a displayField then check if there is a name field
  // @ts-ignore
  return schemaDefinedLinkField || (fieldOrder.includes('name') ? 'name' : null)
}

import { SchemaBuilderType } from './schemaBuilder'
import { DisplayConditions, Field, isFieldTypeObject } from './schemaJson'

export const _getFieldConditions = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string
): DisplayConditions | undefined =>
  schema.getField(modelName, fieldName)?.displayConditions

export const _getFieldDisableCondition = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string
): Field['disabled'] => schema.getField(modelName, fieldName)?.disabled

export const _getDropDownDisableCondition = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string
): Field['disabledDropDown'] => {
  return schema.getField(modelName, fieldName)?.disabledDropDown
  // return R.propOr(
  //   null,
  //   'disabledDropDown',
  //   schema.getField(modelName, fieldName)
  // )
}

export const _getFieldHelpText = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string
): string | null => schema.getField(modelName, fieldName)?.fieldHelp ?? null
//return R.propOr(null, 'fieldHelp', schema.getField(modelName, fieldName))

export const _getRequiredFields = (
  schema: SchemaBuilderType,
  modelName: string
): string[] => schema.getShownFields({ modelName, type: 'required' })

export const _getHasIndex = (
  schema: SchemaBuilderType,
  modelName: string
): boolean => {
  const field = schema.getModel(modelName).hasIndex
  if (typeof field !== 'undefined') {
    return field || false
  } else {
    return true
  }
}

export const _getHasDetail = (
  schema: SchemaBuilderType,
  modelName: string
): boolean => {
  const field = schema.getModel(modelName).hasDetail
  if (typeof field !== 'undefined') {
    return field || false
  } else {
    return true
  }
}

export const _getSingleton = (
  schema: SchemaBuilderType,
  modelName: string
): boolean => schema.getModel(modelName).singleton || false

export const _getEnumChoices = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string
): Record<string, string> =>
  schema.getField(modelName, fieldName)?.choices ?? {}

export const _getEnumChoiceOrder = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string
): string[] => schema.getField(modelName, fieldName)?.choiceOrder ?? []

export const _getCollapsable = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string
): boolean => {
  // this isn't docc'ed anywhere is this dead??
  //return R.propOr(true, 'collapsable', schema.getField(modelName, fieldName))
  return schema.getField(modelName, fieldName)?.collapsable ?? true
}

export const _getSearchable = (
  schema: SchemaBuilderType,
  modelName: string
): boolean => {
  // this isn't' docc'ed anywhere is this dead??
  return schema.getModel(modelName).searchable || false

  //return R.propOr(false, 'searchable', schema.getModel(modelName))
}

export const _getTableLinkField = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldOrder: string[]
): string | null => {
  const model = schema.getModel(modelName)

  const schemaDefinedLinkField = model.tableLinkField

  // If the schema does not define a displayField then check if there is a name field
  return schemaDefinedLinkField || (fieldOrder.includes('name') ? 'name' : null)
}

export const _getTableFields = (
  schema: SchemaBuilderType,
  modelName: string,
  fieldName: string
): string[] => {
  const model = schema.getModel(modelName)
  const fieldType = model.fields?.[fieldName]?.type

  if (isFieldTypeObject(fieldType)) {
    return fieldType.tableFields ?? []
  }

  return []
}

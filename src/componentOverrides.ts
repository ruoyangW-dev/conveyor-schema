import * as R from 'ramda'

// get component overrides for field level

export const _getFieldOverride = (schemaJSON: any, modelName: string, fieldName: string, fieldKey: string) =>
  R.path([modelName, 'fields', fieldName, 'components', fieldKey], schemaJSON)

// get component overrides for model level

export const _getModelOverride = (schemaJSON: any, modelName: string, modelKey: string) =>
  R.path([modelName, 'components', modelKey], schemaJSON)

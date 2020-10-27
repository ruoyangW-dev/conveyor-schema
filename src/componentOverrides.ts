import * as R from 'ramda'
import type { SchemaJSON, BasicObject } from './schemaJson'

// get component overrides for field level

export const _getFieldOverride = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string,
  fieldKey: string
): string | undefined =>
  R.path<string | undefined>(
    [modelName, 'fields', fieldName, 'components', fieldKey],
    schemaJSON
  )

// get component overrides for model level

export const _getModelOverride = (
  schemaJSON: SchemaJSON,
  modelName: string,
  modelKey: string
): string | undefined =>
  R.path<string | undefined>([modelName, 'components', modelKey], schemaJSON)

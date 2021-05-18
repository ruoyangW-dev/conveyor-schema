import type {
  FieldComponents,
  SchemaComponents,
  SchemaJSON
} from './schemaJson'

// get component overrides for field level

export const _getFieldOverride = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string,
  fieldKey: keyof FieldComponents
): (() => JSX.Element) | undefined =>
  schemaJSON?.[modelName]?.fields?.[fieldName]?.components?.[fieldKey]

// get component overrides for model level

export const _getModelOverride = (
  schemaJSON: SchemaJSON,
  modelName: string,
  modelKey: keyof SchemaComponents
): (() => JSX.Element) | undefined =>
  schemaJSON?.[modelName]?.components?.[modelKey]

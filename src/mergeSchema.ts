import * as R from 'ramda'
import type { Field, Schema, SchemaJSON } from './schemaJson'
import { SchemaBuilderType } from './schemaBuilder'

// helpers to merge remote schema or attributes into schemaJSON object

// override is false/undef (default) if current values LEFT ALONE => mergeLEFT
// override is true if new function should override current data => mergeRIGHT
const getCombine = <T extends any, U extends any>(
  override = false
): ((x: T, y: U) => T) => (override ? R.mergeDeepRight : R.mergeDeepLeft)

export const _mergeSchema = (
  schema: SchemaBuilderType,
  remoteSchema: SchemaJSON,
  override = false
): void => {
  const combine = getCombine<SchemaJSON, SchemaJSON>(override)

  schema.schemaJSON = combine(schema.schemaJSON, remoteSchema)
}

export const _mergeDefaultModelAttr = (
  schema: SchemaBuilderType,
  getDefaultModelProps: (props: {
    schema: SchemaBuilderType
    model: Schema
  }) => Schema,
  override?: boolean
): void => {
  const combine = getCombine<Schema, Schema>(override)
  schema.schemaJSON = R.mapObjIndexed(
    (model) => combine(model, getDefaultModelProps({ schema, model })),
    schema.schemaJSON
  )
}

export const _mergeDefaultFieldAttr = (
  schema: SchemaBuilderType,
  getDefaultFieldProps: ({
    schema,
    model,
    field
  }: {
    schema: SchemaBuilderType
    model: Schema
    field: Field
  }) => Field,
  override?: boolean
): void => {
  const combine = getCombine<Field, Field>(override)
  schema.schemaJSON = R.map(
    (model) =>
      R.assoc(
        'fields',
        R.mapObjIndexed(
          (field: Field) =>
            combine(field, getDefaultFieldProps({ schema, model, field })),
          R.prop('fields', model)
        ),
        model
      ),
    schema.schemaJSON
  )
}

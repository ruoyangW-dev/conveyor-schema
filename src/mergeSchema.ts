import * as R from 'ramda'
import type { Field, Fields, Schema, SchemaJSON } from './schemaJson'
import { SchemaBuilderType } from './schemaBuilder'

// helpers to merge remote schema or attributes into schemaJSON object

// override is false/undef (default) if current values LEFT ALONE => mergeLEFT
// override is true if new function should override current data => mergeRIGHT
const getCombine = <
  T extends SchemaJSON | Field | Schema,
  U extends SchemaJSON | Field | Partial<Schema>
>(
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
  }) => Partial<Schema>,
  override?: boolean
): void => {
  const combine = getCombine<Schema, Partial<Schema>>(override)
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

  schema.schemaJSON = R.mapObjIndexed(
    (model) =>
      R.assoc<Fields, Schema, 'fields'>(
        'fields',
        R.mapObjIndexed(
          (field: Field) =>
            combine(field, getDefaultFieldProps({ schema, model, field })),
          model.fields
        ),
        model
      ),
    schema.schemaJSON
  )
}

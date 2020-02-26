import * as R from 'ramda'
import { SchemaBuilderType } from './schemaBuilder'

// helpers to merge remote schema or attributes into schemaJSON object

// override is false/undef (default) if current values LEFT ALONE => mergeLEFT
// override is true if new function should override current data => mergeRIGHT
const getCombine = (override?: boolean) => override ? R.mergeDeepRight : R.mergeDeepLeft

export const _mergeSchema = (schema: SchemaBuilderType, remoteSchema: any, override?: boolean) => {
  const combine = getCombine(override)
  // @ts-ignore
  schema.schemaJSON = combine(schema.schemaJSON, remoteSchema)
}

export const _mergeDefaultModelAttr = (schema: SchemaBuilderType, getDefaultModelProps: any, override?: boolean) => {
  const combine = getCombine(override)
  schema.schemaJSON = R.mapObjIndexed(
      // @ts-ignore
    model => combine(model, getDefaultModelProps({ schema, model })), schema.schemaJSON
  )
}

export const _mergeDefaultFieldAttr = (schema: SchemaBuilderType, getDefaultFieldProps: any, override?: boolean) => {
  const combine = getCombine(override)
  schema.schemaJSON = R.map(
    model => R.assoc(
      'fields',
      R.map(
          // @ts-ignore
        field => combine(field, getDefaultFieldProps({ schema, model, field })),
        R.prop('fields', model)
      ),
      model
    ),
    schema.schemaJSON
  )
}

import {
  _mergeDefaultFieldAttr,
  _mergeDefaultModelAttr,
  _mergeSchema
} from '../src/mergeSchema'
import { SchemaBuilder } from '../src/schemaBuilder'
import { Field, Schema, SchemaJSON } from '../src/schemaJson'
import { mockSchema } from './mocks'

const sch: SchemaJSON = {
  baz: {
    fields: {
      bleh: {
        type: 'string',
        fieldName: 'bleh',
        displayName: 'BLEH'
      }
    },
    modelName: 'baz'
  }
}

describe('mergeSchema', () => {
  describe('_mergeSchema', () => {
    it('should merge Schemas', () => {
      const schemaBuilder = new SchemaBuilder(sch)
      expect(schemaBuilder.schemaJSON['foo']).toBeUndefined()
      _mergeSchema(schemaBuilder, mockSchema)
      expect(schemaBuilder.schemaJSON['foo']).not.toBeUndefined()
    })
  })
  describe('_mergeDefaultModelAttr', () => {
    it('should merge default model attributes', () => {
      const schemaBuilder = new SchemaBuilder(sch)
      const defaultModelAttr = ({
        schema, // eslint-disable-line
        model
      }: {
        schema: SchemaBuilder
        model: Schema
      }): Schema => ({ ...model, displayName: 'test' })
      _mergeDefaultModelAttr(schemaBuilder, defaultModelAttr, true)
      expect(schemaBuilder.schemaJSON['baz'].displayName).toEqual('test')
    })
  })
  describe('_mergeDefaultFieldAttr', () => {
    it('should merge default field attributes', () => {
      const schemaBuilder = new SchemaBuilder(sch)
      const defaultFielder = ({
        schema, //eslint-disable-line
        model, // eslint-disable-line
        field
      }: {
        schema: SchemaBuilder
        model: Schema
        field: Field
      }) => ({ ...field, type: 'int' } as Field)

      _mergeDefaultFieldAttr(schemaBuilder, defaultFielder, true)

      expect(schemaBuilder.schemaJSON.baz.fields.bleh.type).toEqual('int')
    })
  })
})

import type { FieldTypeObject, SchemaJSON } from '../src/schemaJson'

export const mockSchema: SchemaJSON = {
  foo: {
    fields: {
      bar: {
        components: {
          baz: 'bleh'
        },
        displayName: 'FOO',
        fieldName: 'bar',
        type: 'string'
      },
      oneToMany: {
        displayName: 'one to many',
        fieldName: 'oneToMany',
        type: {
          type: 'OneToMany'
        }
      },
      manyToMany: {
        displayName: 'many to many',
        fieldName: 'manyToMany',
        type: {
          type: 'ManyToMany'
        }
      },
      manyToOne: {
        displayName: 'many to one',
        fieldName: 'manyToOne',
        type: {
          type: 'ManyToOne'
        }
      },
      oneToOne: {
        displayName: 'one to one',
        fieldName: 'oneToOne',
        type: {
          type: 'OneToOne'
        }
      },
      enum: {
        displayName: 'Enum',
        fieldName: 'enum',
        type: 'enum'
      },
      url: {
        displayName: 'URL',
        fieldName: 'url',
        type: 'url'
      },
      email: {
        displayName: 'Email',
        fieldName: 'email',
        type: 'email'
      },
      phone: {
        displayName: 'Phone',
        fieldName: 'phone',
        type: 'phone'
      },
      currency: {
        displayName: 'Currency',
        fieldName: 'currency',
        type: 'currency'
      },
      date: {
        displayName: 'Date',
        fieldName: 'date',
        type: 'date'
      },
      text: {
        displayName: 'Text',
        fieldName: 'text',
        type: 'text'
      },
      file: {
        displayName: 'File',
        fieldName: 'file',
        type: 'file'
      },
      boolean: {
        type: 'boolean',
        fieldName: 'boolean',
        displayName: 'boolean'
      },
      password: {
        type: 'password',
        displayName: 'password',
        fieldName: 'password'
      }
    },
    modelName: 'foo',
    components: {
      bar: 'modeloverride'
    }
  }
}

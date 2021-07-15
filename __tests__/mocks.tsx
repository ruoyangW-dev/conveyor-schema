import type { SchemaJSON, Schema } from '../src/schemaJson'
import { SchemaBuilder } from '../src/schemaBuilder'
import React from 'react'

export const mockSchema: SchemaJSON = {
  foo: {
    fields: {
      bar: {
        components: {
          cell: () => <div>2</div>
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
      detail: () => <div>5</div>
    }
  }
}

const DefaultsTest: Schema = {
  fields: {
    id: {
      displayName: ' id ',
      fieldName: 'id',
      type: 'string'
    },
    name: {
      displayName: ' name ',
      fieldName: 'name',
      type: 'string'
    }
  },
  modelName: 'Defaults_Test',
  tableLinkField: 'name',
  fieldOrder: ['name']
}

const PredefinedTest: Schema = {
  deletable: false,
  creatable: false,
  displayField: 'foo',
  displayName: 'Predefined Test',
  displayNamePlural: 'Predefined Tests',
  fields: {
    id: {
      fieldName: 'id',
      type: 'string',
      editable: true,
      displayName: 'ID #',
      showCreate: true,
      showDetail: true,
      showIndex: true,
      showTooltip: true
    },
    name: {
      fieldName: 'name',
      type: 'string',
      editable: false,
      displayName: 'Field Name',
      showCreate: false,
      showDetail: false,
      showTooltip: false
    },
    foo: {
      fieldName: 'foo',
      type: 'string',
      editable: () => true,
      displayName: () => 'foobar',
      showCreate: () => false,
      showDetail: () => false,
      showIndex: () => true,
      showTooltip: () => true
    },
    bar: {
      displayName: ' bar ',
      fieldName: 'bar',
      type: 'string',
      //editable: 42,
      showCreate: false,
      showDetail: false,
      showIndex: true,
      showTooltip: true
    }
  },
  hasIndex: false,
  modelName: 'PredefinedTest',
  tableLinkField: 'name',
  fieldOrder: ['id', 'name', 'foo', 'bar']
}

const ValidCasesTest: Schema = {
  fields: {
    id: {
      displayName: ' id ',
      fieldName: 'id',
      type: 'string'
    },
    name: {
      displayName: ' name ',
      fieldName: 'name',
      type: 'string'
    }
  },
  hasIndex: true,
  displayName: () => 'Pre Test',
  displayNamePlural: () => 'Pre Tests',
  deletable: () => false,
  creatable: () => false,
  displayField: () => 'bar',
  modelName: 'titleize test',
  tableLinkField: 'name',
  fieldOrder: ['name']
}

const InvalidCasesTest: Schema = {
  fields: {
    id: {
      displayName: ' id ',
      fieldName: 'id',
      type: 'string'
    },
    name: {
      displayName: ' name ',
      fieldName: 'name',
      type: 'string'
    }
  },
  fieldName: 'titleize test',
  //deletable: 42,
  //creatable: 42,
  modelName: 'titleize test',
  tableLinkField: 'name',
  fieldOrder: ['name']
}

const titleizeTest: Schema = {
  fields: {
    id: {
      displayName: ' id ',
      fieldName: 'id',
      type: 'string'
    },
    name: {
      displayName: ' name ',
      fieldName: 'name',
      type: 'string'
    }
  },
  fieldName: 'titleize test',
  modelName: 'titleize test',
  tableLinkField: 'name',
  fieldOrder: ['name']
}

const NoModelOverride: Schema = {
  deletable: true,
  creatable: true,
  displayField: 'foo',
  displayName: 'No Model Override',
  displayNamePlural: 'No Model Overrides',
  fields: {
    id: {
      fieldName: 'id',
      type: 'string',
      editable: false,
      displayName: 'ID #',
      showCreate: false,
      showDetail: false,
      showIndex: false,
      showTooltip: false
    },
    name: {
      fieldName: 'name',
      type: 'string',
      editable: true,
      displayName: 'Name',
      showCreate: true,
      showDetail: true,
      showTooltip: true
    }
  },
  hasIndex: true,
  modelName: 'NoModelOverride',
  tableLinkField: 'name',
  fieldOrder: ['name']
}

const ModelOverride: Schema = {
  deletable: true,
  creatable: true,
  displayField: 'name',
  displayName: 'Model Override',
  displayNamePlural: 'Model Overrides',
  fields: {
    id: {
      fieldName: 'id',
      type: 'string',
      editable: false,
      displayName: 'ID #',
      showCreate: false,
      showDetail: false,
      showIndex: false,
      showTooltip: false
    },
    name: {
      fieldName: 'name',
      type: 'string',
      editable: true,
      displayName: 'Name',
      showCreate: true,
      showDetail: true,
      showTooltip: true
    }
  },
  hasIndex: true,
  modelName: 'ModelOverride',
  tableLinkField: 'name',
  fieldOrder: ['name'],
  components: {
    createTitle: () => <h1>Custom Create Title</h1>,
    detailTitle: () => <h1>Custom Detail Title</h1>,
    indexTitle: () => <h1>Custom Index Title</h1>,
    createPage: () => <h1>Custom Create Page</h1>,
    detailPage: () => <h1>Custom Detail Page</h1>,
    indexPage: () => <h1>Custom Index Page</h1>,
    create: () => <h1>Custom Create</h1>,
    detail: () => <h1>Custom Detail</h1>,
    index: () => <h1>Custom Index</h1>
  }
}

export const testSchema: SchemaJSON = {
  DefaultsTest,
  PredefinedTest,
  ValidCasesTest,
  InvalidCasesTest,
  titleizeTest,
  NoModelOverride,
  ModelOverride
}

export const schema = new SchemaBuilder(testSchema)

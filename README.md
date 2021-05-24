# conveyor-schema

[![npm version](https://badge.fury.io/js/%40autoinvent%2Fconveyor-schema.svg)](https://badge.fury.io/js/%40autoinvent%2Fconveyor-schema)
![CI](https://github.com/autoinvent/conveyor-schema/workflows/CI/badge.svg)
![license](https://img.shields.io/github/license/autoinvent/conveyor-schema)

Conveyor-schema is a helper library for @autoinvent/conveyor. It is required for instantiating a SchemaBuilder object to be passed into conveyor's components.

This library provides is an easy way to traverse the schema json used in conveyor's framework.

It contains:

1.) schema getters (so you don't have to traverse the tree structure)

2.) methods for checking mutate-ability (creatable, editable, ect)

3.) schema merge helpers

## Docs

[View the docs here](https://autoinvent.github.io/conveyor-schema/)

## Installation

```bash
yarn add @autoinvent/conveyor-schema
```

With npm:

```bash
npm install --save @autoinvent/conveyor-schema
```

## Usage

### Getting Started

Inside your main project, after generating your raw schema JSON, convert the object to a 'SchemaBuilder' type:

```javascript
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

const schema = new SchemaBuilder(schemaJSON)
```

Now your schema is ready to be passed into any conveyor component

### Traversing the Schema

The `SchemaBuilder` object has methods for easily getting props. You will never have to remember the path to take in order to access attributes.

Furthermore, for schema props which can be a boolean or a function, conveyor-schema evaluates both scenarios and returns the correct value. This is useful for attributes such as 'creatable', 'deletable', and 'editable', which may be associated with a callback.

For example, if you wish to find out if a 'Book' model has an index page you may:

```typescript
const hasIndex = schema.getHasIndex('Book')
```

Alternatively, the 'hard' way of doing this:

```typescript
const hasIndex = schema.schemaJSON['Book'].hasIndex
```

To see a full list of built-in methods, see the SchemaBuilder API docs.

## Development

To create the /lib folder including .d.ts files run:

```
$ yarn build
```

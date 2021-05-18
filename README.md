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

## Basic Usage

Inside your main project, after generating your raw schema JSON, convert the object to a 'SchemaBuilder' type:

```javascript
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

const schema = new SchemaBuilder(schemaJSON)
```

Now your schema is ready to be passed into any conveyor component

## Development

To create the /lib folder including .d.ts files run:

```
$ yarn build
```

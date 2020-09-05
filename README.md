Conveyor-Schema Docs

# Docs

Conveyor-schema is a helper library for @autoinvent/conveyor. It is required for instantiating a SchemaBuilder object to be passed into conveyor's components.

This library provides is an easy way to traverse the schema json used in conveyor's framework.

It contains:

1.) schema getters (so you don't have to traverse the tree structure)

2.) methods for checking mutate-ability (creatable, editable, ect)

3.) schema merge helpers


# Basic Usage

Inside your main project, after generating your raw schema JSON, convert the object to a 'SchemaBuilder' type:

```javascript
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

const schema = new SchemaBuilder(schemaJSON)
```
Now your schema is ready to be passed into any conveyor component



# Development

To create the /lib folder including .d.ts files run:

```
$ yarn run build
```
